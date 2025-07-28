using System.Diagnostics;
using LystraApp.Models;
using Microsoft.AspNetCore.Mvc;

namespace LystraApp.Controllers
{
    public class GaleriController : Controller
    {
        private readonly ILogger<GaleriController> _logger;

        public GaleriController(ILogger<GaleriController> logger)
        {
            _logger = logger;
        }

        public IActionResult Index()
        {
            return View();
        }
    }
}
