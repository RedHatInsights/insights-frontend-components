import { QuestionIcon, SecurityIcon } from '@patternfly/react-icons';
import { Tooltip } from '@patternfly/react-core';
import propTypes from 'prop-types';
import React from 'react';

class ImpactBadge extends React.Component {
    constructor(props) {
        super(props);

        this.colorList = {
            default: 'var(--pf-global--Color--200)', // grey
            danger: 'var(--pf-global--danger-color--100)',
            warning: 'var(--pf-global--warning-color--100)',
            orange: '#ec7a08' // orange
        };

        /* I'm not shure that the list of impacts is ordered correctly by relevancy */
        this.impactList = {
            Critical: {
                title: 'Critical',
                color: this.colorList.danger
            },
            High: {
                title: 'High',
                color: this.colorList.orange
            },
            Important: {
                title: 'Important',
                color: this.colorList.orange
            },
            Medium: {
                title: 'Medium',
                color: this.colorList.warning
            },
            Moderate: {
                title: 'Moderate',
                color: this.colorList.warning
            },
            Low: {
                title: 'Low',
                color: this.colorList.default
            }
        };
    }

    getColoredBadgeByImpact() {
        if (this.impactList.hasOwnProperty(this.props.impact)) {
            return {
                icon: <SecurityIcon size={ this.props.size } color={ this.impactList[this.props.impact].color } />,
                title: this.impactList[this.props.impact].title
            };
        } else {
            return {
                icon: <QuestionIcon size={ this.props.size } color={ this.colorList.default } />,
                title: 'Unknown'
            };
        }
    }

    render() {
        const badge = this.getColoredBadgeByImpact(this.props.impact);
        return (
            <React.Fragment>
                <div>
                    <Tooltip position={this.props.tooltip_position} content={ <div>Impact: { badge.title }</div> }>
                        { badge.icon }
                    </Tooltip>
                </div>
            </React.Fragment>
        );
    }
}

ImpactBadge.defaultProps = {
    impact: 'N/A',
    hastooltip: false,
    tooltip_position: 'right',
    size: 'md'
};

ImpactBadge.propTypes = {
    impact: propTypes.string,
    hastooltip: propTypes.bool,
    tooltip_position: propTypes.string,
    size: propTypes.string // sm, md, lg and xl
};

export default ImpactBadge;
