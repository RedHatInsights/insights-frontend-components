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

    getColoredBadgeByImpact(impact) {
        const iconSize = this.props.size || 'md';
        let badge;

        if (Object.keys(this.impactList).includes(impact)) {
            badge = {
                icon: <SecurityIcon size={ iconSize } color={ this.impactList[impact].color } />,
                title: this.impactList[impact].title
            };
        } else {
            badge = {
                icon: <QuestionIcon size={ iconSize } color={ this.colorList.default } />,
                title: 'Unknown'
            };
        }

        return badge;
    }

    render() {
        const badge = this.getColoredBadgeByImpact(this.props.impact);
        return (
            <React.Fragment>
                <div>
                    <Tooltip position="right" content={ <div>Impact: { badge.title }</div> }>
                        { badge.icon }
                    </Tooltip>
                </div>
            </React.Fragment>
        );
    }
}

ImpactBadge.propTypes = {
    impact: propTypes.string,
    hastooltip: propTypes.bool,
    size: propTypes.string // sm, md, lg and xl
};

export default ImpactBadge;
