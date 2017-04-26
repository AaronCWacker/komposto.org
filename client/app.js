import React from 'react';
import ReactDOM from 'react-dom';
import SketchDetail from './pages/SketchDetail';

const routes = {
	sketchDetail({ sandboxUrl, sketchId }) {
		ReactDOM.render(
			<SketchDetail
				sketchId={ sketchId }
				sandboxUrl={ sandboxUrl }
			/>,
			document.getElementById('root'));
	}
};

const { dataset } = document.body;
(routes)[dataset.controller].call(this, dataset);
