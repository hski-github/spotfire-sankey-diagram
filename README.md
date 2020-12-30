# Spotfire Sankey Diagram

First steps in creating a Spotfire mods visualization for Sankey diagram resp. Alluvial diagrams. Currently using Google Charts Sankey diagram, but has some limitations. Therefore planning for own implementation using plain SVG. Other than in Google Charts Sankey, I am planning to use color for the lines, not the nodes like it is done in the Alluvial diagram in R, see link below.

[![ScreenShot](/screenshots/screenshot-spotfire-sankey-google-charts_thumbnail.png?raw=true)](/screenshots/screenshot-spotfire-sankey-google-charts.png?raw=true)

## Known Limitations 

- No same values on both axis because of limitation in Google Charts Sankey, therefore adding suffix "(From)" and "(To).
- Only two axis
- No control of coloring
- No support for marking 
- No control over sorting


## References
- https://cran.r-project.org/web/packages/alluvial/vignettes/alluvial.html
- http://www.datasmith.org/2020/05/02/alluvial-plots-vs-sankey-diagrams/
- https://stackoverflow.com/questions/4545254/sankey-diagram-in-javascript
- https://developers.google.com/chart/interactive/docs/gallery/sankey
