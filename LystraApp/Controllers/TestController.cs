﻿using Microsoft.AspNetCore.Mvc;

namespace LystraApp.Controllers
{
    public class TestController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
