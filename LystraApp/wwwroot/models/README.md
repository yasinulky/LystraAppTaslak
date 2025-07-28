# 3D Model Klasörü

Bu klasör Lystra Antik Kenti sanal turunda kullanılacak 3D modelleri içerir.

## Desteklenen Formatlar
- GLB (Binary glTF)
- GLTF (JSON glTF)
- OBJ (Wavefront OBJ)

## Model Yerleştirme
1. Model dosyalarını bu klasöre yerleştirin
2. `custom-home.js` dosyasındaki `modelConfigs` objesinde URL'leri güncelleyin

## Örnek Model URL Formatı
```javascript
url: '/models/lystra-antik-sehir.glb'
```

## Performans Önerileri
- Model boyutunu 10MB altında tutun
- LOD (Level of Detail) kullanın
- Texture boyutlarını optimize edin
- Vertex sayısını minimize edin

## Şu Anda Kullanılan Sistemler
Sistemde şu anda procedural geometry kullanılıyor:
- **Antik Şehir**: Ellipsoid + çevredeki binalar
- **Tapınak**: Cylinder + çevredeki sütunlar  
- **Tiyatro**: Ellipsoid + kademeli koltuklar
- **Agora**: Rectangle + çevredeki dükkânlar

Bu geometriler gerçek 3D modellerle değiştirilebilir. 