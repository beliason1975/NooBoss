import React, { Component } from 'react';
import { connect } from 'react-redux';
import { updateMainLocation, updateSubLocation, navigatorUpdateHoverPosition } from '../actions';
import styled from 'styled-components';
import { GL } from '../../utils';

const NavigatorDiv = styled.nav`
	position: relative;
	width: 100%;
	height: 38px;
	overflow: visible;
	box-shadow: ${() => shared.themeMainColor} 0px 0px 4px;
	&:hover{
		box-shadow: ${() => shared.themeMainColor} 0px 0px 13px;
	}
	transition: box-shadow 0.1s;
	background-color: ${props => props.themeMainColor};
	z-index: 1;
	#selector{
		position: absolute;
		width: ${props => (100 / props.numOfLinks) + '%'};
		height: 38px;
		background-color: white;
		z-index: -1;
		margin-left: ${props => (props.hoverPosition * 100 / props.numOfLinks) + '%'};
		transition: margin-left 0.309s;
	}
	a{
		user-select: none;
		color: white;
		display: block;
		float: left;
		font-size: large;
		text-align: center;
		width: ${props => (100 / props.numOfLinks) + '%'};
		transition: color 0.309s;
		cursor: pointer;
		height: 38px;
		line-height: 38px;
		&:nth-child(${props => props.hoverPosition + 2}){
			color: ${props => props.themeMainColor};
		}
		overflow: visible;
		.sub{
			display: none;
			background-color: white;
			position: fixed;
			width: 126.6px;
			a{
				color: ${props => props.themeMainColor};
				width: 126.6px;
				padding-bottom: 3px;
				opacity: 0.5;
				transition: opacity 0.309s;
				&:hover{
					text-decoration: underline;
				}
			}
			a.active{
				opacity: 1;
			}
		}
		&:hover{
			.sub{
				display: block;
			}
		}
	}
	a.active{
		cursor: default;
	}
	a.hasSub{
		&:hover{
			&:after{
				transform: rotate(180deg);
				margin-top: 2px;
			}
			.sub{
				box-shadow: ${() => shared.themeMainColor} 0px 0px 8px;
			}
		}
		&:after{
			transition: transform 0.309s;
			display: block;
			float: right;
			font-size: 0.9em;
			content: '▼';
			margin-right: 4px;
			margin-left: -10px;
		}
	}
`;

const mapStateToProps = (state, ownProps) => {
	return ({
		...ownProps,
		location: state.location,
		navigator: state.navigator,
	});
}

const mapDispatchToProps = (dispatch, ownProps) => {
	return ({
		...ownProps,
		updateMainLocation: (location) => {
			dispatch(updateMainLocation(location));
		},
		navigatorUpdateHoverPosition: (position) => {
			dispatch(navigatorUpdateHoverPosition(position));
		},
		updateSubLocation: (mainLocation, subLocation) => {
			dispatch(updateSubLocation(mainLocation, subLocation));
		},
	})
}

class Navigator extends Component{
	constructor(props) {
		super(props);
		this.state = {
			linkList: [
				{ main: 'overview' },
				{ main: 'extensions', sub: ['manage', 'autoState'] },
				{ main: 'userscripts' },
				{ main: 'history' },
				{ main: 'options' },
				{ main: 'about' }
			]
		};
	}
	getLink(link, index, isActive) {
		let hasSub = '';
		if (link.sub) {
			hasSub = 'hasSub';
		}
		return (
			<a key={index}
				className={(isActive ? 'active' : '') + ' ' + hasSub}
				onClick={() => {
					this.props.updateMainLocation(link.main);
					this.props.navigatorUpdateHoverPosition(index);
				}}
				onMouseOver={() => {
					this.props.navigatorUpdateHoverPosition(index);
				}}
			>
				{GL(link.main)}
				{
					link.sub ? (
						<div className="sub">
							{
								link.sub.map((elem, index) => {
									let isActive = '';
									if (elem == this.props.location.sub[link.main]) {
										isActive = 'active';
									}
									return <a key={index} className={isActive} onClick={this.props.updateSubLocation.bind(this, link.main, elem)}>{GL(elem)}</a>
								})
							}
						</div>
					) : null
				}
			</a>
		);
	}

	render() {
		let activePosition = 0;
		const links = this.state.linkList.map((link, index) => {
			if (this.props.location.main == link.main) {
				activePosition = index;
				return this.getLink(link, index, true);
			}
			else {
				return this.getLink(link, index);
			}
		});
		return (
			<NavigatorDiv
				themeMainColor={window.shared.themeMainColor}
				themeSubColor={window.shared.themeSubColor}
				numOfLinks={links.length}
				hoverPosition={this.props.navigator.hoverPosition}
				onMouseOut={() => {
					this.props.navigatorUpdateHoverPosition(activePosition);
				}}
			>
				<div id="selector" />
				{links}
			</NavigatorDiv>
		);
	}
}

export default connect(
	mapStateToProps, 
	mapDispatchToProps
)(Navigator);
