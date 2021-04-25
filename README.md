# Spotfire Sankey Diagram

Spotfire mods visualization for Sankey diagram resp. Alluvial diagrams in Spotfire. 

Visualize many-to-many relationships between two or more categories or change of categories over time.

Sankey diagrams are visualizations used to show a flow from one set of values to another. Sankeys are best used when you want to show a many-to-many mapping between two or more categories (e.g. product categories, vendors and distribution channel) or multiple paths through a set of stages resp. change of categories over time (e.g. shift of votes over the last elections).

In the category "X" axis you select the different layers, while the continuous "Y" axis is used for the size of the connections between the layers.   

[![ScreenShot](/screenshots/screen-recording-spotfire-sankey.gif?raw=true)](/screenshots/screen-recording-spotfire-sankey.gif?raw=true)

Using R package for Alluvial as reference for layout and color. Started using D3 resp. Google Charts for Sankey, but then switched to plain SVG implementation due to constraints regarding coloring and  sorting.
 

## Open Topics 
- Better layout of labels for category values https://github.com/hski-github/spotfire-sankey-diagram/issues/3
- Better layout in tool tip for information about category and continuous values https://github.com/hski-github/spotfire-sankey-diagram/issues/4
- Better layout of path objects so that smallest are shown in the foreground https://github.com/hski-github/spotfire-sankey-diagram/issues/5


## References
- https://cran.r-project.org/web/packages/alluvial/vignettes/alluvial.html
- http://www.datasmith.org/2020/05/02/alluvial-plots-vs-sankey-diagrams/
- https://stackoverflow.com/questions/4545254/sankey-diagram-in-javascript
- https://developers.google.com/chart/interactive/docs/gallery/sankey
- https://github.com/d3/d3-sankey
- https://observablehq.com/collection/@d3/d3-sankey
- https://www.tagesschau.de/inland/btw17/waehlerwanderung-115.html
- https://github.com/microsoft/powerbi-visuals-sankey


## How to get started with development 
All source code for the mod example can be found in the `src` folder. 
These instructions assume that you have [Node.js](https://nodejs.org/en/) (which includes npm) installed. 

- Open a terminal at the location of this example.
- Run `npm install`. This will install necessary tools. Run this command only the first time you are building the mod and skip this step for any subsequent builds.
- Run `npm run server`. This will start a development server.
- Start editing, for example `src/main.js`.
- In Spotfire, follow the steps of creating a new mod and connecting to the development server.
