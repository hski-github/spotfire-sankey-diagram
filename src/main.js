/**
 * Get access to the Spotfire Mod API by providing a callback to the initialize method.
 * @param {Spotfire.Mod} mod - mod api
 */
Spotfire.initialize(async (mod) => {
    /**
     * Create the read function.
     */
    const reader = mod.createReader(mod.visualization.data(), mod.windowSize(), mod.property("myProperty"));

    /**
     * Store the context.
     */
    const context = mod.getRenderContext();

    /**
     * Initiate the read loop
     */
    reader.subscribe(render);

    /**
     * @param {Spotfire.DataView} dataView
     * @param {Spotfire.Size} windowSize
     * @param {Spotfire.ModProperty<string>} prop
     */
    async function render(dataView, windowSize, prop) {
        /**
         * Check the data view for errors
         */
        let errors = await dataView.getErrors();
        if (errors.length > 0) {
            // Showing an error overlay will hide the mod iframe.
            // Clear the mod content here to avoid flickering effect of
            // an old configuration when next valid data view is received.
            mod.controls.errorOverlay.show(errors);
            return;
        }
        mod.controls.errorOverlay.hide();

        /**
         * Get rows from dataView
         */
        const rows = await dataView.allRows();
        if (rows == null) {
            // User interaction caused the data view to expire.
            // Don't clear the mod content here to avoid flickering.
            return;
        }

        /**
         * Print out to document
         */
		google.charts.load('current', {'packages':['sankey']});
		google.charts.setOnLoadCallback(drawChart);

		function drawChart() {
			var data = new google.visualization.DataTable();
			data.addColumn('string', 'From');
			data.addColumn('string', 'To');
			data.addColumn('number', 'Weight');
			data.addRows([
		      [ 'A', 'X', 5 ],
		      [ 'A', 'Y', 7 ],
		      [ 'A', 'Z', 6 ],
		      [ 'B', 'X', 2 ],
		      [ 'B', 'Y', 9 ],
		      [ 'B', 'Z', 4 ]
			]);

			// Sets chart options.
			var options = { width: 600, height: 200 };

			// Instantiates and draws our chart, passing in some options.
			var chart = new google.visualization.Sankey(document.getElementById('mod-container'));
			chart.draw(data, options);
		}

        /**
         * Signal that the mod is ready for export.
         */
        context.signalRenderComplete();
    }
});
