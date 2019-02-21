import { QuestionIcon, SecurityIcon } from '@patternfly/react-icons';
import { Tooltip } from '@patternfly/react-core';
import propTypes from 'prop-types';
import React from 'react';
import { impactList, colorList } from './consts';

class Shield extends React.Component {
    constructor(props) {
        super(props);
    }

    getColoredBadgeByImpact() {
        if (impactList.hasOwnProperty(this.props.impact)) {
            return {
                icon: <SecurityIcon size={ this.props.size } color={ impactList[this.props.impact].color } />,
                title: impactList[this.props.impact].title
            };
        } else {
            return {
                icon: <QuestionIcon size={ this.props.size } color={ colorList.default } />,
                title: 'Unknown'
            };
        }
    }

    render() {
        const badge = this.getColoredBadgeByImpact();
        return (
            <React.Fragment>
                { this.props.hasTooltip === true ? (
                    <Tooltip
                        position={ this.props.tooltipPosition }
                        content={ <div>{ this.props.tooltipPrefix + (this.props.title || badge.title) }</div> }
                    >
                        { badge.icon }
                    </Tooltip>
                ) : (
                    <span>{ badge.icon }</span>
                ) }
            </React.Fragment>
        );
    }
}

Shield.defaultProps = {
    impact: 'N/A',
    hasTooltip: false,
    tooltipPosition: 'right',
    tooltipPrefix: '',
    title: '',
    size: 'md'
};

Shield.propTypes = {
    impact: propTypes.string,
    hasTooltip: propTypes.bool,
    tooltipPosition: propTypes.string,
    tooltipPrefix: propTypes.string,
    title: propTypes.string,
    size: propTypes.string // sm, md, lg and xl
};

export default Shield;
