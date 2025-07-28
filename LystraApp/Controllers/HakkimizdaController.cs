using System.Diagnostics;
using LystraApp.Models;
using Microsoft.AspNetCore.Mvc;

namespace LystraApp.Controllers
{
    public class HakkimizdaController : Controller
    {
        private readonly ILogger<HakkimizdaController> _logger;

        public HakkimizdaController(ILogger<HakkimizdaController> logger)
        {
            _logger = logger;
        }

        public IActionResult Index()
        {
            return View();
        }
    }
}
