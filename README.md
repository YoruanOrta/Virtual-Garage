# 🚗 Virtual Garage

An interactive virtual workshop where you can customize 3D vehicles with real modifications and see their performance impact.

## 🌟 Features

- **20+ Vehicle Brands** with real models
- **Real-time 3D customization** - see changes instantly
- **Real modifications** with accurate HP data
- **Advanced color system** with interactive picker
- **Performance charts** showing real HP gains
- **Local save** for personalized configurations
- **Responsive interface** optimized for all devices

## 🛠️ Tech Stack

### Frontend

- **React 18** - Main framework
- **Three.js + React Three Fiber** - 3D rendering
- **Vite** - Optimized build tool
- **Chart.js** - Performance charts
- **Styled Components** - Dynamic styling

### Backend

- **Node.js + Express** - REST API
- **NHTSA API** - Official vehicle data
- **JSON Database** - Local database (temporary)

### 3D Assets

- **Blender** - Model processing
- **Three.js GLB** - Optimized model format
- **Sketchfab** - Source of 3D models

## 🚀 Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/your-username/Virtual-Garage.git
cd Virtual-Garage
```

### 2. Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

### 3. Setup Backend

```bash
cd backend
npm install
npm run dev
```

### 4. Open in browser

```bash
Frontend: http://localhost:5173
Backend API: http://localhost:3001
```

## 📁 Project Structure

```bash
Virtual-Garage/
├── frontend/          # React + Three.js
├── backend/           # Node.js API
├── 3d-assets/         # 3D models and textures
├── data/              # JSON database
└── docs/              # Documentation
```

## 🎮 How to Use

1. **Select a brand** - Choose from 20+ available brands
2. **Pick your vehicle** - At least 3 models per brand
3. **Customize the color** - Interactive color panel
4. **Add modifications** - Turbo, intercooler, exhaust, etc.
5. **See the impact** - Real-time HP chart
6. **Save your build** - Store your creations

## 🔧 Available Modifications

### Engine

- Turbocharger (+45 HP)
- Supercharger (+60 HP)
- Cold Air Intake (+8 HP)
- Intercooler (+15 HP)
- ECU Tune (+25 HP)

### Exhaust

- Cat-Back System (+12 HP)
- Performance Headers (+18 HP)
- Full Exhaust (+28 HP)

### Aerodynamics

- Front Splitter
- Rear Wing
- Side Skirts
- Rear Diffuser

### Wheels

- 17", 18", 19" Performance Wheels

## 🎨 Color System

- **10 solid colors** basic
- **3 metallic finishes** premium
- **3 matte finishes** exclusive
- **Custom color picker**

## 📊 Included Brands (Example)

| Brand    | Models                | Status |
|----------|-----------------------|--------|
| Toyota   | Corolla, Supra, RAV4 | ✅      |
| Honda    | Civic Si, Accord, NSX | ✅      |
| Ford     | Mustang GT, F-150, Focus RS | ✅ |
| BMW      | M3, X5, i8            | 🚧     |
| Mercedes | C63 AMG, GLE, A45     | 🚧     |

## 🤝 Contribute

1. Fork the project
2. Create your feature branch (`git checkout -b feature/new-brand`)
3. Commit your changes (`git commit -m 'Add new brand BMW'`)
4. Push to the branch (`git push origin feature/new-brand`)
5. Open a Pull Request

## 📝 Roadmap

- [x] Basic project setup
- [x] Vehicle database
- [x] Modifications system
- [ ] 3D implementation
- [ ] Customization panel
- [ ] Save system
- [ ] NHTSA API integration
- [ ] More brands and models
- [ ] User system
- [ ] Social sharing

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for details.

## 🙏 Acknowledgments

- **Sketchfab** - 3D models
- **NHTSA** - Official vehicle data
- **Three.js Community** - Resources and tutorials

---

**Ready to build your dream car?** 🏁
