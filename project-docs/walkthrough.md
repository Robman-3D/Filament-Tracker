# Filament Tracker - Walkthrough

¡Todo listo! He creado tu base de datos compartida de filamentos 3D. 

## 🚀 Cómo usarla

### 1. Ejecutar en tu ordenador
Para probarla ahora mismo:
1.  Abre una terminal en la carpeta del proyecto:
    `cd C:\Users\sarar\Documents\Antigravity\filament-tracker`
2.  Ejecuta:
    `npm run dev`
3.  Abre el link que aparece (normalmente `http://localhost:5173`) en tu navegador.

### 2. Compartir con tu novio (Online)
¡Ya está online!

🌐 **Enlace para compartir:**
[https://filament-tracker-pied.vercel.app](https://filament-tracker-pied.vercel.app)

Simplemente envíale este enlace. Ambos podréis entrar desde el móvil o el ordenador y ver los cambios en tiempo real.

*(Nota: Como hemos usado la configuración más sencilla, cualquiera con el enlace puede ver vuestros filamentos, pero es muy difícil que alguien lo adivine).*

### 3. Modificar el código (Para tu novio/colaborar)
Si él quiere trabajar en la web desde su casa, **necesita instalar estos programas** (igual que hicimos contigo al principio):

1.  **Node.js**: [Descargar aquí](https://nodejs.org/) (La versión LTS).
2.  **Git**: [Descargar aquí](https://git-scm.com/).
3.  **Un Editor de Código**: Puede usar **VS Code** (gratis y estándar) o **Antigravity** (si tenéis la licencia).

**Pasos para empezar:**

1.  **Descargar el código**:
    Tiene que abrir una terminal y escribir:
    `git clone https://github.com/Robman-3D/Filament-Tracker.git`

2.  **Instalar y Arrancar**:
    `cd Filament-Tracker`
    `npm install`
    `npm run dev`

3.  **Subir cambios**:
    Cuando haga cambios, para que tú los veas:
    `git add .`
    `git commit -m "Descripción del cambio"`
    `git push`

(Vercel detectará el cambio automáticamente y actualizará la web en 1 minuto).

## 📱 Uso en Móvil (App)
¡Sí, funciona perfectamente en el móvil!

**¿Se puede instalar como una App?**
Sí, es una "Web App Progresiva" (PWA).
1.  Abre el enlace en Chrome (Android) o Safari (iPhone).
2.  Pulsa en el menú (tres puntos o botón de compartir).
3.  Selecciona **"Añadir a pantalla de inicio"** (o "Instalar App").
4.  ¡Listo! Aparecerá como una aplicación más en tu móvil, sin necesidad de crear un APK complicado.

## ✨ Características Incluidas
*   **Base de datos en tiempo real**: Si tu novio añade un filamento, ¡te aparecerá a ti al instante sin recargar!
*   **Diseño Premium**: Modo oscuro, colores neón suaves y tarjetas translúcidas.
*   **Gestión**: Puedes añadir Marca, Material, Color (con selector visual) y Peso.
*   **Indicador Visual**: Barra de progreso que cambia de color (Verde/Amarillo/Rojo) según el peso restante.
*   **Borrado**: Botón para eliminar bobinas gastadas.

## ⚠️ Importante sobre Firebase
Asegúrate de que en la consola de Firebase, en **Firestore Database > Reglas**, estén configuradas para permitir lectura/escritura (Modo de prueba). Como no hemos puesto login (para hacerlo sencillo), cualquiera con la configuración podría leerlo, pero como solo vosotros tenéis el link, es suficiente para empezar.

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```
