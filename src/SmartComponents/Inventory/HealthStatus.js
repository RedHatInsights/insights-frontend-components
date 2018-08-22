import React from 'react';
import PropTypes from 'prop-types';
import { ShieldAltIcon, DollarSignIcon, WrenchIcon, CertificateIcon } from '@patternfly/react-icons';

const HealthToIcon = {
  cost: <DollarSignIcon />,
  configuration: <WrenchIcon />,
  compliance: <CertificateIcon />,
  vulnerabilities: <ShieldAltIcon />
}

class HealthStatus extends React.Component {
  constructor(props) {
    super(props)
  }

  onStatusClicked(event, clickedOn) {
    event.stopPropagation();
    console.log(event, clickedOn);
  }

  render() {
    const { items, className } = this.props;
    return (
      <div className={className}>
        {items && Object.keys(items).map(oneKey => (
          <div key={oneKey} onClick={(event) => this.onStatusClicked(event, items[oneKey])}>
            <span>{HealthToIcon[oneKey]}</span>
            <span>{items[oneKey].title}</span>
          </div>
        ))}
      </div>
    )
  }
}

HealthStatus.propTypes = {
  items: PropTypes.any
}

export default HealthStatus;