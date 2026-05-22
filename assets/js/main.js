$(document).ready(function () {
  // --- FITUR DARK MODE ---
  const html = $("html");
  const themeToggleBtn = $("#themeToggle");

  // Cek apakah user sebelumnya udah milih dark mode atau pengaturan sistemnya dark
  if (
    localStorage.getItem("theme") === "dark" ||
    (!("theme" in localStorage) &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)
  ) {
    html.addClass("dark");
  }

  // Aksi ketika tombol Dark Mode di-klik
  themeToggleBtn.on("click", function () {
    html.toggleClass("dark");
    if (html.hasClass("dark")) {
      localStorage.setItem("theme", "dark");
    } else {
      localStorage.setItem("theme", "light");
    }
  });

  // --- FITUR COPY KREDENSIAL ---
  $(".copy-btn").on("click", function () {
    const targetId = $(this).data("target");
    const textToCopy = $("#" + targetId).text();
    const btn = $(this);
    const originalText = btn.text();

    navigator.clipboard.writeText(textToCopy).then(function () {
      // Ubah tampilan tombol jadi hijau dan teks 'Copied!'
      btn
        .text("Copied!")
        .removeClass(
          "bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-700",
        )
        .addClass(
          "bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-200 hover:bg-green-300",
        );

      // Balikin tombol ke semula setelah 2 detik
      setTimeout(function () {
        btn
          .text(originalText)
          .removeClass(
            "bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-200 hover:bg-green-300",
          )
          .addClass(
            "bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-700",
          );
      }, 2000);
    });
  });

  // --- LOGIKA LOGIN (Khusus halaman index.html) ---
  $("#loginForm").submit(function (e) {
    e.preventDefault();

    const btn = $("#submitBtn");
    const alertBox = $("#alert");

    // State loading
    btn.text("Memproses...").prop("disabled", true).addClass("opacity-70");
    alertBox
      .addClass("hidden")
      .removeClass(
        "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-200 bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-200",
      );

    const payload = {
      email: $("#email").val(),
      password: $("#password").val(),
    };

    $.ajax({
      url: "/api/login",
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify(payload),
      success: function (response) {
        // Tampilkan sukses
        alertBox
          .html("Login berhasil! Mengalihkan...")
          .addClass(
            "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-200",
          )
          .removeClass("hidden");

        // Simpan email sementara buat ditampilin di halaman dashboard
        localStorage.setItem("activeUser", payload.email);

        // Pindah halaman ke dashboard.html setelah 1 detik
        setTimeout(function () {
          window.location.href = "/dashboard.html";
        }, 1000);
      },
      error: function (xhr) {
        // Tampilkan error
        const errorMsg = xhr.responseJSON
          ? xhr.responseJSON.error
          : "Terjadi kesalahan server.";
        alertBox
          .text(errorMsg)
          .addClass(
            "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-200",
          )
          .removeClass("hidden");
        btn.text("Masuk").prop("disabled", false).removeClass("opacity-70");
      },
    });
  });

  // --- LOGIKA DASHBOARD (Khusus halaman dashboard.html) ---
  if (window.location.pathname.includes("dashboard.html")) {
    const activeUser = localStorage.getItem("activeUser");

    if (activeUser) {
      $("#userDisplay").text(activeUser);
    } else {
      window.location.href = "/";
    }

    $("#logoutBtn").on("click", function () {
      localStorage.removeItem("activeUser");
      window.location.href = "/";
    });
  }
});
