using System.Diagnostics;
using LystraApp.Models;
using Microsoft.AspNetCore.Mvc;

namespace LystraApp.Controllers
{
    public class YayinlarimizController : Controller
    {
        private readonly ILogger<YayinlarimizController> _logger;

        public YayinlarimizController(ILogger<YayinlarimizController> logger)
        {
            _logger = logger;
        }

        public IActionResult Index()
        {
            return View();
        }
    }
}
