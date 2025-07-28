using System.Diagnostics;
using LystraApp.Models;
using Microsoft.AspNetCore.Mvc;

namespace LystraApp.Controllers
{
    public class HaberlerController : Controller
    {
        private readonly ILogger<HaberlerController> _logger;

        public HaberlerController(ILogger<HaberlerController> logger)
        {
            _logger = logger;
        }

        public IActionResult Index()
        {
            return View();
        }
    }
}