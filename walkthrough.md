# Walkthrough - Live Power Flow Animation Component

We created and styled a live power flow visualization card that renders a schematic flow diagram of the inverter and all ingress/egress nodes in real-time.

## Features of the Visualization

1. **Center Inverter Node**: Houses a central spinning gear icon and displays the operation mode with a pulsing status ring that glows when there is active power flow.
2. **Top Solar Node**: Displays active PV total power flowing down into the inverter.
3. **Right Battery Node**: Displays battery power charging or discharging, alongside the state-of-charge percentage.
4. **Left Grid Node**: Displays grid power and indicates whether it is importing or exporting.
5. **Essential Loads (Left T-junction)**:
   * **UPS (Heavy)** (top-left) and **Load** (bottom-left) branch directly from the grid-to-inverter line to reflect how they tap off the main electrical bus.
6. **Auxiliary/Controlled Loads (Bottom)**:
   * **Light Load** and **Smart Load** are positioned below the inverter with curved paths.
7. **Dynamic Animation Speeds**:
   * The speed of the glowing particles on the active lines is computed dynamically from the wattage. Higher power results in faster flows, while zero or low power hides the animations.

## Layout Configuration
The nodes are laid out in a cross schematic structure on a `1000 x 500` SVG viewBox:

![Live Power Flow Animation](file:///C:/Users/lemon/.gemini/antigravity-ide/brain/f0274f3b-f451-40fc-aefa-f86c2fcae12a/power_flow_visualization_centered_1781782359850.png)

## Component Integration
* The new component is implemented in [PowerFlowAnimation.vue](file:///c:/Users/lemon/Desktop/Solarmax%20ulra%20pv%209000/frontend/app/components/PowerFlowAnimation.vue).
* It is mounted in the main Nuxt app layout at [app.vue](file:///c:/Users/lemon/Desktop/Solarmax%20ulra%20pv%209000/frontend/app/app.vue#L5-L13).
