using System.Diagnostics;
using LystraApp.Models;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace LystraApp.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;

        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }

        // Virtual Tour API Endpoints
        [HttpGet]
        public IActionResult GetModelInfo(string modelType)
        {
            var models = new Dictionary<string, object>
            {
                ["city"] = new
                {
                    name = "Antik Şehir",
                    description = "Lystra Antik Kenti'nin genel görünümü. Roma ve Bizans dönemlerinden kalma yapılar.",
                    coordinates = new { lat = 38.3675, lng = 32.6569 },
                    details = new[]
                    {
                        "Roma İmparatorluğu dönemine ait şehir planlaması",
                        "Byzans döneminden kalma yapı kalıntıları", 
                        "Antik yol sistemi ve su yolları",
                        "Konut alanları ve ticaret bölgeleri"
                    }
                },
                ["temple"] = new
                {
                    name = "Tapınak Kalıntıları",
                    description = "Roma tanrılarına adanmış tapınak kompleksi. Korint sütunları ve altar kalıntıları.",
                    coordinates = new { lat = 38.3676, lng = 32.6570 },
                    details = new[]
                    {
                        "Korint düzeninde sütun başlıkları",
                        "Mermer altar kalıntıları",
                        "Tapınak cella'sı ve pronaos",
                        "Zeus'a adanmış kurban sunakları"
                    }
                },
                ["theater"] = new
                {
                    name = "Antik Tiyatro",
                    description = "4000 kişilik antik dönem tiyatro kompleksi. Mükemmel akustik özellikler.",
                    coordinates = new { lat = 38.3674, lng = 32.6568 },
                    details = new[]
                    {
                        "4000 kişilik izleyici kapasitesi",
                        "Mükemmel doğal akustik sistem",
                        "Sahne binası (skene) kalıntıları",
                        "Cavea (oturma alanları) terracing"
                    }
                },
                ["agora"] = new
                {
                    name = "Agora Alanı",
                    description = "Ticaret ve sosyal yaşamın merkezi agora. Çevrili sütunlu avlu.",
                    coordinates = new { lat = 38.3677, lng = 32.6571 },
                    details = new[]
                    {
                        "Merkezi ticaret alanı",
                        "Dor düzeninde sütunlu portikler",
                        "Stoa (kapalı yürüyüş alanları)",
                        "Dükkân kalıntıları ve depo alanları"
                    }
                }
            };

            if (models.ContainsKey(modelType))
            {
                return Json(models[modelType]);
            }

            return NotFound(new { error = "Model bulunamadı" });
        }

        [HttpGet]
        public IActionResult GetAvailableModels()
        {
            var models = new[]
            {
                new { id = "city", name = "Antik Şehir", icon = "fa-city", available = true },
                new { id = "temple", name = "Tapınak Kalıntıları", icon = "fa-landmark", available = true },
                new { id = "theater", name = "Antik Tiyatro", icon = "fa-masks-theater", available = true },
                new { id = "agora", name = "Agora Alanı", icon = "fa-building-columns", available = true }
            };

            return Json(new { models = models, success = true });
        }

        [HttpPost]
        public IActionResult SaveTourPreferences([FromBody] TourPreferencesModel preferences)
        {
            try
            {
                // Kullanıcı tercihlerini session'da sakla
                HttpContext.Session.SetString("TourPreferences", JsonSerializer.Serialize(preferences));
                
                return Json(new { success = true, message = "Tercihler kaydedildi" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Tur tercihleri kaydedilirken hata oluştu");
                return Json(new { success = false, message = "Tercihler kaydedilemedi" });
            }
        }

        [HttpGet]
        public IActionResult GetTourPreferences()
        {
            try
            {
                var preferencesJson = HttpContext.Session.GetString("TourPreferences");
                if (string.IsNullOrEmpty(preferencesJson))
                {
                    // Varsayılan tercihler
                    return Json(new
                    {
                        lightIntensity = 1.0,
                        shadowsEnabled = true,
                        atmosphereEnabled = true,
                        preferredModel = "city"
                    });
                }

                var preferences = JsonSerializer.Deserialize<TourPreferencesModel>(preferencesJson);
                return Json(preferences);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Tur tercihleri alınırken hata oluştu");
                return Json(new { error = "Tercihler alınamadı" });
            }
        }

        [HttpPost]
        public IActionResult ReportIssue([FromBody] IssueReportModel report)
        {
            try
            {
                // Gerçek uygulamada bu bilgiler veritabanına kaydedilir
                _logger.LogWarning($"Sanal tur sorunu rapor edildi: {report.Description}");
                
                return Json(new { success = true, message = "Sorun raporu alındı. En kısa sürede incelenecek." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Sorun raporu gönderilirken hata oluştu");
                return Json(new { success = false, message = "Rapor gönderilemedi" });
            }
        }
    }

    // Model classes for API requests
    public class TourPreferencesModel
    {
        public double LightIntensity { get; set; }
        public bool ShadowsEnabled { get; set; }
        public bool AtmosphereEnabled { get; set; }
        public string PreferredModel { get; set; } = "city";
        public string Quality { get; set; } = "high";
    }

    public class IssueReportModel
    {
        public string Description { get; set; } = "";
        public string ModelType { get; set; } = "";
        public string UserAgent { get; set; } = "";
        public DateTime Timestamp { get; set; } = DateTime.Now;
    }
}
