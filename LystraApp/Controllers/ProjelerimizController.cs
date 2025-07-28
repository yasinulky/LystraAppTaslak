using System.Diagnostics;
using LystraApp.Models;
using Microsoft.AspNetCore.Mvc;

namespace LystraApp.Controllers
{
    public class ProjelerimizController : Controller
    {
        private readonly ILogger<ProjelerimizController> _logger;

        public ProjelerimizController(ILogger<ProjelerimizController> logger)
        {
            _logger = logger;
        }

        public IActionResult Index()
        {
            return View();
        }
    }
}
