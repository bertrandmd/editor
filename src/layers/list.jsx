import React from 'react'
import Immutable from 'immutable'

import Heading from 'rebass/dist/Heading'
import Toolbar from 'rebass/dist/Toolbar'
import NavItem from 'rebass/dist/NavItem'
import Space from 'rebass/dist/Space'

import { LayerEditor } from './editor.jsx'
import scrollbars from '../scrollbars.scss'
import PureRenderMixin from 'react-addons-pure-render-mixin';

// List of collapsible layer editors
export class LayerList extends React.Component {
	static propTypes = {
		layers: React.PropTypes.instanceOf(Immutable.OrderedMap),
		onLayersChanged: React.PropTypes.func.isRequired
	}

	constructor(props) {
		super(props)
		this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
	}

	onLayerDestroyed(deletedLayer) {
		const remainingLayers = this.props.layers.delete(deletedLayer.get('id'))
		this.props.onLayersChanged(remainingLayers)
	}

	onLayerChanged(layer) {
		const changedLayers = this.props.layers.set(layer.get('id'), layer)
		this.props.onLayersChanged(changedLayers)
	}

	render() {
		var layerPanels = []
		layerPanels = this.props.layers.map(layer => {
			return <LayerEditor
				key={layer.get('id')}
				layer={layer}
				onLayerDestroyed={this.onLayerDestroyed.bind(this)}
				onLayerChanged={this.onLayerChanged.bind(this)}
			/>
		}).toIndexedSeq()

		return <div>
			<Toolbar style={{marginRight: 20}}>
				<NavItem>
					<Heading>Layers</Heading>
				</NavItem>
				<Space auto x={1} />
			</Toolbar>

			<div className={scrollbars.darkScrollbar} style={{
				overflowY: "scroll",
				bottom:0,
				left:0,
				right:0,
				top:40,
				position: "absolute",
			}}>
			{layerPanels}
			</div>
		</div>
	}
}
