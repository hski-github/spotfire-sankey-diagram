# Spotfire Sankey Diagram

Spotfire mods visualization for Sankey diagram resp. Alluvial diagrams in Spotfire. 

Visualize many-to-many relationships between two or more categories or change of categories over time.

Sankey diagrams are visualizations used to show a flow from one set of values to another. Sankeys are best used when you want to show a many-to-many mapping between two or more categories (e.g. product categories, vendors and distribution channel) or multiple paths through a set of stages resp. change of categories over time (e.g. shift of votes over the last elections).

In the category "X" axis you select the different layers, while the continuous "Y" axis is used for the size of the connections between the layers.   

[![ScreenShot](/screenshots/screen-recording-spotfire-sankey.gif?raw=true)](/screenshots/screen-recording-spotfire-sankey.gif?raw=true)

Using R package for Alluvial as reference for layout and color. Started using D3 resp. Google Charts for Sankey, but then switched to plain SVG implementation due to constraints regarding coloring and  sorting.

## Example

Lets analyze as an exmaple electoral swing and visualize how votes of people or states changed comparing two or more elections. 

Please find a dataset about national elections in Germany in the examples folder DEU Bundestagswahl Waehlerwanderung 2013 2017.csv https://github.com/hski-github/spotfire-sankey-diagram/blob/main/examples/DEU%20Bundestagswahl%20Waehlerwanderung%202013%202017.csv which contains data from https://www.tagesschau.de/wahl/archiv/2017-09-24-BT-DE/index.shtml. 

The data contains how many people voted in 2013 for one party and in 2017 for the same or another party. For example 11m people voted in 2013 for Union and also in 2017, 5,9m peopled voted in 2013 for SPD and also in 2017, while 800k people voted in 2013 for Union and changed to SPD in 2017, and 820k people changed from Union to SPD.

- Download the dataset from the examples folder
- Load the dataset to TIBCO Spotfire
- Add a Sankey diagram and add "Stimmen" resp. "Sum(Stimmen)" to X axis 
- Add "Bundestagswahl 2013" and "Bundestagswahl 2017" to the Y axis
- Put "Bundestagswahl 2017" to colors 
- (Optional) Adjust the colors to the typical colors of the partys
- (Optional) Add a data table as detailed visualization. 

See the result here https://github.com/hski-github/spotfire-sankey-diagram/blob/main/examples/DEU%20Bundestagswahl%20Waehlerwanderung%20Sankey%20Diagram.png

As a more complex example from data preparation perspective lets use data from Hardvard Dataverse https://dataverse.harvard.edu/dataset.xhtml?persistentId=doi:10.7910/DVN/42MVDX  containing constituency (state-level) returns for elections to the U.S. presidency. 

- Download the data as CSV from Hardvard Dataverse 
- Import the data into Spotfire 
- In the data panel 
-- Filter rows for [year]>=2012
-- Create a new calculated column maxcandidatevotes using Max([candidatevotes]) Over ([year],[state])=[candidatevotes]
-- Filter rows for [maxcandidatevotes]=True  
-- Pivot the data with one row per state and create columns for candidate and party_simplified per year
- to be continued


## Open Topics 
- Better layout of labels for category values https://github.com/hski-github/spotfire-sankey-diagram/issues/3
- Better layout of path objects to simplify visualization with less crossings and clear flow https://github.com/hski-github/spotfire-sankey-diagram/issues/5


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
