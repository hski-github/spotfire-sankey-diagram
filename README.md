# Spotfire Sankey Diagram

Spotfire mods visualization for Sankey diagram resp. Alluvial diagrams in Spotfire. 

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
