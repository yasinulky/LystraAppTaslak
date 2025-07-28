document.addEventListener('DOMContentLoaded', function() {
    // Hero Slider
    const heroSwiper = new Swiper('.hero-slider .swiper-container', {
        loop: true,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        effect: 'fade',
        fadeEffect: {
            crossFade: true
        },
        pagination: {
            el: '.hero-pagination .swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.hero-button-next',
            prevEl: '.hero-button-prev',
        },
    });

    // Modern Appointment Form
    const appointmentForm = document.getElementById('appointmentForm');
    const successMessage = document.getElementById('successMessage');

    appointmentForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Form verilerini topla
        const formData = {
            visitDate: document.getElementById('visitDate').value,
            fullName: document.getElementById('fullName').value,
            phone: document.getElementById('phone').value,
            email: document.getElementById('email').value,
            visitorCount: document.getElementById('visitorCount').value,
            notes: document.getElementById('notes').value
        };

        // Validasyon
        if (!formData.visitDate || !formData.fullName || !formData.phone || !formData.email || !formData.visitorCount) {
            showNotification('Lütfen zorunlu alanları doldurun.', 'error');
            return;
        }

        // E-posta formatı kontrolü
        const emailPattern = '^[^\s@]+@[^\s@]+\.[^\s@]+$';
        const emailRegex = new RegExp(emailPattern);
        if (!emailRegex.test(formData.email)) {
            showNotification('Lütfen geçerli bir e-posta adresi girin.', 'error');
            return;
        }

        // Telefon formatı kontrolü
        const phonePattern = '^[0-9\s\-\(\)]{10,}$';
        const phoneRegex = new RegExp(phonePattern);
        if (!phoneRegex.test(formData.phone)) {
            showNotification('Lütfen geçerli bir telefon numarası girin.', 'error');
            return;
        }

        // Loading durumu
        const submitBtn = this.querySelector('.submit-btn');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span class="btn-text">Gönderiliyor...</span><i class="fa-solid fa-spinner fa-spin"></i>';
        submitBtn.disabled = true;

        // Simüle edilmiş API çağrısı
        setTimeout(() => {
            // Başarı mesajını göster
            this.style.display = 'none';
            successMessage.style.display = 'block';
            
            // 5 saniye sonra formu tekrar göster
            setTimeout(() => {
                successMessage.style.display = 'none';
                this.style.display = 'flex';
                this.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 5000);
        }, 1500);
    });

    // Bildirim sistemi
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 16px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 600;
            z-index: 9999;
            transform: translateX(400px);
            transition: transform 0.3s ease;
            max-width: 350px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        `;
        
        if (type === 'error') {
            notification.style.background = 'linear-gradient(135deg, #ff6b6b, #ee5a52)';
        } else {
            notification.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
        }
        
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // Animasyon
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Otomatik kaldırma
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // Input animasyonları
    const inputs = document.querySelectorAll('.input-wrapper input, .input-wrapper select, .input-wrapper textarea');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'scale(1.02)';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'scale(1)';
        });
    });

    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('visitDate').setAttribute('min', today);
});

// Utility functions
function scrollToAppointment() {
    document.querySelector('.appointment-section').scrollIntoView({
        behavior: 'smooth'
    });
}

function showArtifactDetail(artifactType) {
    let message = '';
    
    switch(artifactType) {
        case 'mozaik':
            message = 'Antik Mozaikler: Roma dönemine ait renkli mozaik parçaları detaylı inceleme için galeri sayfasını ziyaret edin.';
            break;
        case 'sikke':
            message = 'Antik Sikkeler: Roma İmparatorluğu dönemine ait nadir sikke koleksiyonu hakkında daha fazla bilgi için müzemizi ziyaret edin.';
            break;
        case 'seramik':
            message = 'Seramik Eserler: Günlük yaşam eşyaları ve dekoratif seramikler hakkında detaylı bilgi için yayınlarımızı inceleyin.';
            break;
        case 'mimari':
            message = 'Mimari Kalıntılar: Antik yapı kalıntıları ve mimari öğeler hakkında rehberli turlarımıza katılabilirsiniz.';
            break;
        default:
            message = 'Daha fazla bilgi için bizimle iletişime geçin.';
    }
    
    alert(message);
}

// ========================================
// CESIUM.JS VIRTUAL TOUR FUNCTIONALITY
// ========================================

// Global variables for Cesium
let viewer = null;
let currentModel = null;
let modelEntities = {};
let defaultView = {
    destination: Cesium.Cartesian3.fromDegrees(32.6570, 38.3676, 800),
    orientation: {
        heading: Cesium.Math.toRadians(0),
        pitch: Cesium.Math.toRadians(-35),
        roll: 0.0
    }
};

// Model configurations with fallback geometry - Centered layout
const modelConfigs = {
    city: {
        name: 'Antik Şehir',
        description: 'Lystra Antik Kenti\'nin genel görünümü. Roma ve Bizans dönemlerinden kalma yapılar.',
        position: Cesium.Cartesian3.fromDegrees(32.6570, 38.3676, 0),
        url: null, // Will use procedural geometry
        scale: 10.0,
        minimumPixelSize: 64,
        cameraPosition: Cesium.Cartesian3.fromDegrees(32.6570, 38.3676, 800),
        color: Cesium.Color.SANDYBROWN
    },
    temple: {
        name: 'Tapınak Kalıntıları',
        description: 'Roma tanrılarına adanmış tapınak kompleksi. Korint sütunları ve altar kalıntıları.',
        position: Cesium.Cartesian3.fromDegrees(32.6571, 38.3677, 0),
        url: null, // Will use procedural geometry
        scale: 15.0,
        minimumPixelSize: 128,
        cameraPosition: Cesium.Cartesian3.fromDegrees(32.6571, 38.3677, 600),
        color: Cesium.Color.LIGHTYELLOW
    },
    theater: {
        name: 'Antik Tiyatro',
        description: '4000 kişilik antik dönem tiyatro kompleksi. Mükemmel akustik özellikler.',
        position: Cesium.Cartesian3.fromDegrees(32.6569, 38.3675, 0),
        url: null, // Will use procedural geometry
        scale: 8.0,
        minimumPixelSize: 64,
        cameraPosition: Cesium.Cartesian3.fromDegrees(32.6569, 38.3675, 600),
        color: Cesium.Color.WHEAT
    },
    agora: {
        name: 'Agora Alanı',
        description: 'Ticaret ve sosyal yaşamın merkezi agora. Çevrili sütunlu avlu.',
        position: Cesium.Cartesian3.fromDegrees(32.6572, 38.3678, 0),
        url: null, // Will use procedural geometry
        scale: 12.0,
        minimumPixelSize: 96,
        cameraPosition: Cesium.Cartesian3.fromDegrees(32.6572, 38.3678, 600),
        color: Cesium.Color.BURLYWOOD
    }
};

// Initialize Cesium viewer when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    loadUserPreferences();
    initializeCesiumViewer();
});

// This function is now defined later in the file with enhanced error handling

function loadModel(modelType) {
    if (!viewer || !modelConfigs[modelType]) return;

    // Show loading
    showLoadingOverlay();

    // Remove current model if exists
    if (currentModel) {
        viewer.entities.remove(currentModel);
    }

    const config = modelConfigs[modelType];

    try {
        // Create procedural 3D geometry since external models might not load
        currentModel = create3DStructure(modelType, config);
        
        if (currentModel) {
            viewer.entities.add(currentModel);
        } else {
            throw new Error('Model oluşturulamadı');
        }

        // Store the entity
        modelEntities[modelType] = currentModel;

        // Fly to the model
        viewer.flyTo(currentModel, {
            duration: 2.0,
            offset: new Cesium.HeadingPitchRange(0, Cesium.Math.toRadians(-30), 300)
        }).then(() => {
            hideLoadingOverlay();
        });

        // Update UI
        updateModelInfo(config);
        updateActiveModelButton(modelType);
        updateActiveInfoCard(modelType);

    } catch (error) {
        console.error('Error loading model:', error);
        hideLoadingOverlay();
        showErrorMessage('3D model yüklenirken bir hata oluştu.');
    }
}

function initializeEventListeners() {
    // Model selection buttons
    document.querySelectorAll('.model-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const modelType = this.getAttribute('data-model');
            loadModel(modelType);
        });
    });

    // Info cards
    document.querySelectorAll('.info-card').forEach(card => {
        card.addEventListener('click', function() {
            const modelType = this.getAttribute('data-model');
            loadModel(modelType);
        });
    });

    // Camera controls
    document.getElementById('resetView').addEventListener('click', function() {
        viewer.camera.setView(defaultView);
    });

    document.getElementById('topView').addEventListener('click', function() {
        if (currentModel) {
            viewer.flyTo(currentModel, {
                duration: 1.5,
                offset: new Cesium.HeadingPitchRange(0, Cesium.Math.toRadians(-90), 1000)
            });
        }
    });

    document.getElementById('groundView').addEventListener('click', function() {
        if (currentModel) {
            viewer.flyTo(currentModel, {
                duration: 1.5,
                offset: new Cesium.HeadingPitchRange(0, Cesium.Math.toRadians(-10), 50)
            });
        }
    });

    // View controls
    document.getElementById('lightIntensity').addEventListener('input', function() {
        const intensity = parseFloat(this.value);
        if (viewer.scene.light) {
            viewer.scene.light.intensity = intensity;
        }
    });

    document.getElementById('shadowToggle').addEventListener('change', function() {
        viewer.shadows = this.checked;
        if (currentModel) {
            currentModel.model.shadows = this.checked ? 
                Cesium.ShadowMode.ENABLED : Cesium.ShadowMode.DISABLED;
        }
    });

    document.getElementById('atmosphereToggle').addEventListener('change', function() {
        viewer.scene.globe.showGroundAtmosphere = this.checked;
        viewer.scene.globe.dynamicAtmosphereLighting = this.checked;
    });

    // Fullscreen button
    document.getElementById('fullscreenBtn').addEventListener('click', function() {
        toggleFullscreen();
    });

    // Screenshot button
    document.getElementById('screenshotBtn').addEventListener('click', function() {
        takeScreenshot();
    });

    // Navigation help
    document.getElementById('closeHelp').addEventListener('click', function() {
        hideNavigationHelp();
    });

    // Update coordinates on camera move
    viewer.camera.changed.addEventListener(function() {
        updateCoordinates();
    });
}

function updateModelInfo(config) {
    const modelInfo = document.getElementById('modelInfo');
    if (modelInfo) {
        modelInfo.textContent = config.description;
    }
}

function updateActiveModelButton(modelType) {
    document.querySelectorAll('.model-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    const activeBtn = document.querySelector(`[data-model="${modelType}"]`);
    if (activeBtn && activeBtn.classList.contains('model-btn')) {
        activeBtn.classList.add('active');
    }
}

function updateActiveInfoCard(modelType) {
    document.querySelectorAll('.info-card').forEach(card => {
        card.classList.remove('active');
    });
    
    const activeCard = document.querySelector(`.info-card[data-model="${modelType}"]`);
    if (activeCard) {
        activeCard.classList.add('active');
    }
}

function updateCoordinates() {
    // Koordinat görüntüleme kaldırıldı
    return;
}

let loadingStep = 0;

function showLoadingOverlay(title = 'Model Yükleniyor...', text = 'Lütfen bekleyiniz') {
    const overlay = document.getElementById('loadingOverlay');
    const loadingTitle = document.getElementById('loadingTitle');
    const loadingText = document.getElementById('loadingText');
    
    if (overlay) {
        overlay.classList.add('active');
        
        if (loadingTitle) loadingTitle.textContent = title;
        if (loadingText) loadingText.textContent = text;
        
        // Animate progress bar
        const progressFill = document.getElementById('loadingProgress');
        if (progressFill) {
            progressFill.style.width = '0%';
            setTimeout(() => {
                progressFill.style.width = '30%';
            }, 300);
        }
        
        // Reset loading steps
        resetLoadingSteps();
    }
}

function updateLoadingStep(step) {
    const steps = ['step1', 'step2', 'step3'];
    
    steps.forEach((stepId, index) => {
        const stepElement = document.getElementById(stepId);
        if (stepElement) {
            stepElement.classList.remove('active', 'completed');
            
            if (index < step) {
                stepElement.classList.add('completed');
            } else if (index === step) {
                stepElement.classList.add('active');
            }
        }
    });
    
    // Update progress bar
    const progressFill = document.getElementById('loadingProgress');
    if (progressFill) {
        const progress = ((step + 1) / 3) * 100;
        progressFill.style.width = `${Math.min(progress, 90)}%`;
    }
}

function resetLoadingSteps() {
    const steps = ['step1', 'step2', 'step3'];
    steps.forEach(stepId => {
        const stepElement = document.getElementById(stepId);
        if (stepElement) {
            stepElement.classList.remove('active', 'completed');
        }
    });
    
    // Activate first step
    const firstStep = document.getElementById('step1');
    if (firstStep) {
        firstStep.classList.add('active');
    }
}

function hideLoadingOverlay() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        // Complete all steps
        updateLoadingStep(3);
        
        const progressFill = document.getElementById('loadingProgress');
        if (progressFill) {
            progressFill.style.width = '100%';
        }
        
        setTimeout(() => {
            overlay.classList.remove('active');
        }, 1200);
    }
}

function showNavigationHelp() {
    const helpPanel = document.getElementById('navigationHelp');
    if (helpPanel) {
        helpPanel.classList.add('show');
        
        // Auto hide after 10 seconds
        setTimeout(() => {
            hideNavigationHelp();
        }, 10000);
    }
}

function hideNavigationHelp() {
    const helpPanel = document.getElementById('navigationHelp');
    if (helpPanel) {
        helpPanel.classList.remove('show');
    }
}

function toggleFullscreen() {
    const container = document.querySelector('.cesium-viewer-container');
    const btn = document.getElementById('fullscreenBtn');
    
    if (!document.fullscreenElement) {
        container.requestFullscreen().then(() => {
            btn.innerHTML = '<i class="fa-solid fa-compress"></i>';
            btn.setAttribute('data-tooltip', 'Tam Ekrandan Çık');
        });
    } else {
        document.exitFullscreen().then(() => {
            btn.innerHTML = '<i class="fa-solid fa-expand"></i>';
            btn.setAttribute('data-tooltip', 'Tam Ekran');
        });
    }
}

function takeScreenshot() {
    if (!viewer) return;
    
    try {
        viewer.render();
        const canvas = viewer.scene.canvas;
        
        // Create download link
        const link = document.createElement('a');
        link.download = `lystra-sanal-tur-${new Date().toISOString().slice(0, 10)}.png`;
        link.href = canvas.toDataURL();
        
        // Trigger download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Show success message
        showNotification('Ekran görüntüsü başarıyla kaydedildi!', 'success');
        
    } catch (error) {
        console.error('Screenshot error:', error);
        showNotification('Ekran görüntüsü alınırken bir hata oluştu.', 'error');
    }
}

function showErrorMessage(message) {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.querySelector('h4').textContent = 'Hata!';
        overlay.querySelector('p').textContent = message;
        overlay.querySelector('.loader-3d').style.display = 'none';
        overlay.querySelector('.progress-bar').style.display = 'none';
        overlay.style.display = 'flex';
    }
}

// Notification function (enhanced version)
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 20px;
        border-radius: 12px;
        color: white;
        font-weight: 600;
        z-index: 9999;
        transform: translateX(400px);
        transition: all 0.4s ease;
        max-width: 350px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.3);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255,255,255,0.1);
        display: flex;
        align-items: center;
        gap: 12px;
    `;
    
    let icon = '';
    if (type === 'error') {
        notification.style.background = 'linear-gradient(135deg, #ff6b6b, #ee5a52)';
        icon = '<i class="fa-solid fa-exclamation-triangle"></i>';
    } else if (type === 'success') {
        notification.style.background = 'linear-gradient(135deg, #64ffda, #00bcd4)';
        notification.style.color = '#1a1a2e';
        icon = '<i class="fa-solid fa-check-circle"></i>';
    } else {
        notification.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
        icon = '<i class="fa-solid fa-info-circle"></i>';
    }
    
    notification.innerHTML = icon + '<span>' + message + '</span>';
    document.body.appendChild(notification);
    
    // Animation
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 400);
    }, 4000);
}

// Handle window resize for Cesium
window.addEventListener('resize', function() {
    if (viewer) {
        viewer.resize();
    }
});

// API Integration Functions
async function loadUserPreferences() {
    try {
        const response = await fetch('/Home/GetTourPreferences');
        const preferences = await response.json();
        
        if (preferences) {
            // Apply preferences to UI
            const lightSlider = document.getElementById('lightIntensity');
            const shadowToggle = document.getElementById('shadowToggle');
            const atmosphereToggle = document.getElementById('atmosphereToggle');
            
            if (lightSlider) lightSlider.value = preferences.lightIntensity || 1.0;
            if (shadowToggle) shadowToggle.checked = preferences.shadowsEnabled !== false;
            if (atmosphereToggle) atmosphereToggle.checked = preferences.atmosphereEnabled !== false;
        }
    } catch (error) {
        console.warn('Could not load user preferences:', error);
    }
}

async function saveUserPreferences() {
    try {
        const preferences = {
            lightIntensity: parseFloat(document.getElementById('lightIntensity')?.value || 1.0),
            shadowsEnabled: document.getElementById('shadowToggle')?.checked || true,
            atmosphereEnabled: document.getElementById('atmosphereToggle')?.checked || true,
            preferredModel: document.querySelector('.model-btn.active')?.getAttribute('data-model') || 'city',
            quality: 'high'
        };
        
        await fetch('/Home/SaveTourPreferences', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(preferences)
        });
    } catch (error) {
        console.warn('Could not save user preferences:', error);
    }
}

async function loadModelDetails(modelType) {
    try {
        const response = await fetch(`/Home/GetModelInfo?modelType=${modelType}`);
        const modelInfo = await response.json();
        
        if (modelInfo && modelInfo.details) {
            updateDetailedModelInfo(modelInfo);
        }
    } catch (error) {
        console.warn('Could not load model details:', error);
    }
}

function updateDetailedModelInfo(modelInfo) {
    const modelInfoPanel = document.getElementById('modelInfo');
    if (modelInfoPanel) {
        let detailsHtml = `<strong>${modelInfo.name}</strong><br>`;
        detailsHtml += `<p style="margin: 10px 0; font-size: 0.85rem;">${modelInfo.description}</p>`;
        detailsHtml += '<ul style="font-size: 0.8rem; margin: 10px 0; padding-left: 15px;">';
        
        modelInfo.details.forEach(detail => {
            detailsHtml += `<li style="margin-bottom: 5px;">${detail}</li>`;
        });
        
        detailsHtml += '</ul>';
        modelInfoPanel.innerHTML = detailsHtml;
    }
}

async function reportIssue(description, modelType) {
    try {
        const report = {
            description: description,
            modelType: modelType,
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString()
        };
        
        const response = await fetch('/Home/ReportIssue', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(report)
        });
        
        const result = await response.json();
        if (result.success) {
            showNotification(result.message, 'success');
        } else {
            showNotification(result.message || 'Rapor gönderilemedi', 'error');
        }
    } catch (error) {
        console.error('Error reporting issue:', error);
        showNotification('Rapor gönderilirken bir hata oluştu', 'error');
    }
}

// Enhanced loadModel function with API integration
async function loadModelEnhanced(modelType) {
    if (!viewer || !modelConfigs[modelType]) return;

    // Show loading
    showLoadingOverlay();

    // Load detailed model information
    await loadModelDetails(modelType);

    // Clear all existing entities
    viewer.entities.removeAll();
    currentModel = null;

    const config = modelConfigs[modelType];

    try {
        // Create procedural 3D geometry since external models might not load
        currentModel = create3DStructure(modelType, config);
        
        if (currentModel) {
            viewer.entities.add(currentModel);
        } else {
            throw new Error('Model oluşturulamadı');
        }

        // Store the entity
        modelEntities[modelType] = currentModel;

        // Fly to the model
        await viewer.flyTo(currentModel, {
            duration: 2.0,
            offset: new Cesium.HeadingPitchRange(0, Cesium.Math.toRadians(-30), 300)
        });
        
        hideLoadingOverlay();

        // Update UI
        updateActiveModelButton(modelType);
        updateActiveInfoCard(modelType);
        
        // Save preferences
        await saveUserPreferences();

    } catch (error) {
        console.error('Error loading model:', error);
        hideLoadingOverlay();
        showErrorMessage('3D model yüklenirken bir hata oluştu.');
        
        // Report the issue automatically
        await reportIssue(`Model yükleme hatası: ${error.message}`, modelType);
    }
}

// Enhanced event listeners with preference saving
function initializeEnhancedEventListeners() {
    // Model selection buttons
    document.querySelectorAll('.model-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const modelType = this.getAttribute('data-model');
            loadModelEnhanced(modelType);
        });
    });

    // Info cards
    document.querySelectorAll('.info-card').forEach(card => {
        card.addEventListener('click', function() {
            const modelType = this.getAttribute('data-model');
            loadModelEnhanced(modelType);
        });
    });

    // Camera controls
    document.getElementById('resetView').addEventListener('click', function() {
        viewer.camera.setView(defaultView);
    });

    document.getElementById('topView').addEventListener('click', function() {
        if (currentModel) {
            viewer.flyTo(currentModel, {
                duration: 1.5,
                offset: new Cesium.HeadingPitchRange(0, Cesium.Math.toRadians(-90), 1000)
            });
        }
    });

    document.getElementById('groundView').addEventListener('click', function() {
        if (currentModel) {
            viewer.flyTo(currentModel, {
                duration: 1.5,
                offset: new Cesium.HeadingPitchRange(0, Cesium.Math.toRadians(-10), 50)
            });
        }
    });

    // View controls with preference saving
    document.getElementById('lightIntensity').addEventListener('input', function() {
        const intensity = parseFloat(this.value);
        if (viewer.scene.light) {
            viewer.scene.light.intensity = intensity;
        }
        // Debounced save
        clearTimeout(this.saveTimeout);
        this.saveTimeout = setTimeout(saveUserPreferences, 1000);
    });

    document.getElementById('shadowToggle').addEventListener('change', function() {
        viewer.shadows = this.checked;
        if (currentModel) {
            currentModel.model.shadows = this.checked ? 
                Cesium.ShadowMode.ENABLED : Cesium.ShadowMode.DISABLED;
        }
        saveUserPreferences();
    });

    document.getElementById('atmosphereToggle').addEventListener('change', function() {
        viewer.scene.globe.showGroundAtmosphere = this.checked;
        viewer.scene.globe.dynamicAtmosphereLighting = this.checked;
        saveUserPreferences();
    });

    // Fullscreen button
    document.getElementById('fullscreenBtn').addEventListener('click', function() {
        toggleFullscreen();
    });

    // Screenshot button
    document.getElementById('screenshotBtn').addEventListener('click', function() {
        takeScreenshot();
    });

    // Navigation help
    document.getElementById('closeHelp').addEventListener('click', function() {
        hideNavigationHelp();
    });

    // Update coordinates on camera move
    viewer.camera.changed.addEventListener(function() {
        updateCoordinates();
    });
}

// Performance monitoring
let performanceStats = {
    frameRate: 0,
    lastFrameTime: Date.now(),
    frameCount: 0
};

function monitorPerformance() {
    if (!viewer) return;
    
    const now = Date.now();
    performanceStats.frameCount++;
    
    if (now - performanceStats.lastFrameTime >= 1000) {
        performanceStats.frameRate = performanceStats.frameCount;
        performanceStats.frameCount = 0;
        performanceStats.lastFrameTime = now;
        
        // Auto-adjust quality if performance is low
        if (performanceStats.frameRate < 15 && viewer.scene.fxaa) {
            viewer.scene.fxaa = false;
/*             showNotification('Performans optimizasyonu: Anti-aliasing kapatıldı', 'info');
 */        }
    }
}

// Start performance monitoring
setInterval(monitorPerformance, 100);

// Update loadModel to use enhanced version
function loadModel(modelType) {
    return loadModelEnhanced(modelType);
}

// Update initializeEventListeners to use enhanced version
function initializeEventListeners() {
    return initializeEnhancedEventListeners();
}

// Create 3D structures procedurally
function create3DStructure(modelType, config) {
    const entities = [];
    
    switch(modelType) {
        case 'city':
            return createAncientCity(config);
        case 'temple':
            return createTemple(config);
        case 'theater':
            return createTheater(config);
        case 'agora':
            return createAgora(config);
        default:
            return createDefaultStructure(config);
    }
}

function createAncientCity(config) {
    const cityEntity = {
        name: config.name,
        position: config.position,
        ellipsoid: {
            radii: new Cesium.Cartesian3(60, 60, 25),
            material: config.color.withAlpha(0.8),
            outline: true,
            outlineColor: Cesium.Color.DARKGOLDENROD,
            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
        }
    };
    
    // Add surrounding buildings - centered layout
    setTimeout(() => {
        for (let i = 0; i < 12; i++) {
            const angle = (i / 12) * 2 * Math.PI;
            const distance = 100;
            const x = distance * Math.cos(angle);
            const y = distance * Math.sin(angle);
            
            const buildingPos = Cesium.Cartesian3.fromDegrees(
                32.6570 + (x / 111320), 
                38.3676 + (y / 110540), 
                0
            );
            
            viewer.entities.add({
                name: `Antik Bina ${i + 1}`,
                position: buildingPos,
                box: {
                    dimensions: new Cesium.Cartesian3(12, 12, Math.random() * 15 + 8),
                    material: Cesium.Color.SANDYBROWN.withAlpha(0.7),
                    outline: true,
                    outlineColor: Cesium.Color.BROWN,
                    heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
                }
            });
        }
    }, 1000);
    
    return cityEntity;
}

function createTemple(config) {
    const templeEntity = {
        name: config.name,
        position: config.position,
        cylinder: {
            length: 40,
            topRadius: 30,
            bottomRadius: 35,
            material: config.color.withAlpha(0.9),
            outline: true,
            outlineColor: Cesium.Color.DARKGOLDENROD,
            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
        }
    };
    
    // Add columns around the temple
    setTimeout(() => {
        for (let i = 0; i < 12; i++) {
            const angle = (i / 12) * 2 * Math.PI;
            const radius = 45;
            const x = radius * Math.cos(angle);
            const y = radius * Math.sin(angle);
            
            const columnPos = Cesium.Cartesian3.fromDegrees(
                32.6571 + (x / 111320), 
                38.3677 + (y / 110540), 
                0
            );
            
            viewer.entities.add({
                name: `Sütun ${i + 1}`,
                position: columnPos,
                cylinder: {
                    length: 25,
                    topRadius: 3,
                    bottomRadius: 3,
                    material: Cesium.Color.WHEAT.withAlpha(0.8),
                    outline: true,
                    outlineColor: Cesium.Color.BROWN,
                    heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
                }
            });
        }
    }, 1000);
    
    return templeEntity;
}

function createTheater(config) {
    const theaterEntity = {
        name: config.name,
        position: config.position,
        ellipsoid: {
            radii: new Cesium.Cartesian3(60, 40, 15),
            material: config.color.withAlpha(0.8),
            outline: true,
            outlineColor: Cesium.Color.DARKSLATEGRAY,
            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
        }
    };
    
    // Add theater seats (steps)
    setTimeout(() => {
        for (let row = 0; row < 8; row++) {
            const radius = 35 + (row * 5);
            const seatsInRow = 12 + (row * 2);
            
            for (let seat = 0; seat < seatsInRow; seat++) {
                const angle = (seat / seatsInRow) * Math.PI; // Half circle for theater
                const x = radius * Math.cos(angle);
                const y = radius * Math.sin(angle);
                
                const seatPos = Cesium.Cartesian3.fromDegrees(
                    32.6569 + (x / 111320), 
                    38.3675 + (y / 110540), 
                    row * 2
                );
                
                viewer.entities.add({
                    name: `Koltuk ${row}-${seat}`,
                    position: seatPos,
                    box: {
                        dimensions: new Cesium.Cartesian3(2, 2, 1),
                        material: Cesium.Color.GRAY.withAlpha(0.6),
                        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
                    }
                });
            }
        }
    }, 1000);
    
    return theaterEntity;
}

function createAgora(config) {
    const agoraEntity = {
        name: config.name,
        position: config.position,
        rectangle: {
            coordinates: Cesium.Rectangle.fromDegrees(
                32.6571, 38.3677, 32.6573, 38.3679
            ),
            material: config.color.withAlpha(0.7),
            outline: true,
            outlineColor: Cesium.Color.DARKGOLDENROD,
            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
            height: 5
        }
    };
    
    // Add shops around the agora
    setTimeout(() => {
        const shopPositions = [
            [32.6571, 38.3677], [32.6572, 38.3677], [32.6573, 38.3677],
            [32.6571, 38.3678], [32.6573, 38.3678],
            [32.6571, 38.3679], [32.6572, 38.3679], [32.6573, 38.3679]
        ];
        
        shopPositions.forEach((pos, index) => {
            const shopPos = Cesium.Cartesian3.fromDegrees(pos[0], pos[1], 0);
            
            viewer.entities.add({
                name: `Dükkân ${index + 1}`,
                position: shopPos,
                box: {
                    dimensions: new Cesium.Cartesian3(8, 8, 12),
                    material: Cesium.Color.BURLYWOOD.withAlpha(0.8),
                    outline: true,
                    outlineColor: Cesium.Color.BROWN,
                    heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
                }
            });
        });
    }, 1000);
    
    return agoraEntity;
}

function createDefaultStructure(config) {
    return {
        name: config.name,
        position: config.position,
        box: {
            dimensions: new Cesium.Cartesian3(20, 20, 15),
            material: config.color.withAlpha(0.8),
            outline: true,
            outlineColor: Cesium.Color.BLACK,
            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
        }
    };
}

// Enhanced error handling with loading steps
function initializeCesiumViewer() {
    const cesiumContainer = document.getElementById('cesiumContainer');
    if (!cesiumContainer) {
        console.error('Cesium container not found');
        return;
    }

    // Show initial loading
    showLoadingOverlay('Sanal Tur Başlatılıyor...', 'Sistem hazırlanıyor, lütfen bekleyiniz');
    updateLoadingStep(0);

    try {
        // Step 1: Imagery provider
        setTimeout(() => {
            updateLoadingStep(0);
            
            const imageryProvider = new Cesium.OpenStreetMapImageryProvider({
                url: 'https://a.tile.openstreetmap.org/'
            });

            // Step 2: Create viewer
            setTimeout(() => {
                updateLoadingStep(1);
                
                viewer = new Cesium.Viewer('cesiumContainer', {
                    imageryProvider: imageryProvider,
                    timeline: false,
                    animation: false,
                    homeButton: true,
                    sceneModePicker: true,
                    baseLayerPicker: false,
                    navigationHelpButton: false,
                    fullscreenButton: false,
                    geocoder: false,
                    infoBox: false,
                    selectionIndicator: false,
                    shadows: true,
                    requestRenderMode: true,
                    maximumRenderTimeChange: Infinity
                });

                // Set initial view
                viewer.camera.setView(defaultView);

                // Configure globe
                viewer.scene.globe.enableLighting = true;
                viewer.scene.globe.dynamicAtmosphereLighting = false;
                viewer.scene.globe.showGroundAtmosphere = true;

                // Configure scene
                viewer.scene.fxaa = true;
                if (viewer.scene.postProcessStages) {
                    viewer.scene.postProcessStages.fxaa.enabled = true;
                }

                // Step 3: Load models
                setTimeout(() => {
                    updateLoadingStep(2);
                    
                    // Load initial model
                    setTimeout(() => {
                        loadModel('city');
                        
                        // Initialize event listeners
                        initializeEventListeners();
                        
                        // Hide loading overlay
                        setTimeout(() => {
                            hideLoadingOverlay();
                            
                            // Show navigation help after everything is loaded
                            setTimeout(() => {
                                showNavigationHelp();
                            }, 1000);
                        }, 1000);
                        
                    }, 800);
                }, 1000);
            }, 800);
        }, 500);

        console.log('Cesium viewer initialization started');

    } catch (error) {
        console.error('Error initializing Cesium viewer:', error);
        showErrorMessage('3D görüntüleyici yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin.');
    }
}

// Cleanup on page unload
window.addEventListener('beforeunload', function() {
    if (viewer) {
        viewer.destroy();
        viewer = null;
    }
});