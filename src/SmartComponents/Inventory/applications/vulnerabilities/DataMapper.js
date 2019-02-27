import React from 'react';
import { Shield } from '../../../../PresentationalComponents/Shield';
import { LongTextTooltip } from '../../../../PresentationalComponents/LongTextTooltip';
import { parseCvssScore, processDate } from '../../../../Utilities/helpers';

export function createCveListBySystem({ isLoading, ...rest }) {
    if (!isLoading) {
        const { payload: { data, meta }} = rest;
        return {
            data: data.map(row => ({
                id: row.id,
                cells: [
                    <Shield
                        impact={ row.attributes.impact }
                        hasTooltip={ true }
                        tooltipPosition={ 'right' }
                        key={ row.id.toString() }
                    />,
                    row.attributes.synopsis,
                    <LongTextTooltip
                        content={ row.attributes.description }
                        maxLength={ 200 }
                        tooltipPosition={ 'top' }
                        tooltipMaxWidth={ '50vw' }
                        key={ row.id.toString() }
                    />,
                    parseCvssScore(row.attributes.cvss2_score, row.attributes.cvss3_score),
                    processDate(row.attributes.public_date)
                ]
            })),
            meta,
            isLoading
        };
    }

    return { data: [], meta: (rest.payload && rest.payload.meta) || {}, isLoading };
}
