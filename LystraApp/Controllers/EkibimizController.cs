using System.Diagnostics;
using LystraApp.Models;
using Microsoft.AspNetCore.Mvc;

namespace LystraApp.Controllers
{
    public class EkibimizController : Controller
    {
        private readonly ILogger<EkibimizController> _logger;

        public EkibimizController(ILogger<EkibimizController> logger)
        {
            _logger = logger;
        }

        public IActionResult Index()
        {
            return View();
        }
    }
}
