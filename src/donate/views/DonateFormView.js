import React from 'react';
import PriceHandle from '../components/PriceHandle';
import SelectButton from '../components/SelectButton';

const priceHandles = {
  oneTime: [
    {
      id: 11,
      image: 'https://placeimg.com/160/130/nature',
      desc: 'Can provide bandages and painkillers in an emergency.',
      price: '$30',
    },
    {
      id: 12,
      image: 'https://placeimg.com/160/130/people',
      desc: 'Could save a life by providing antivenom after a snakebite.',
      price: '$60',
    }
  ],
  monthly: [
    {
      id: 21,
      image: 'https://placeimg.com/160/130/tech',
      desc: 'Can ensure that every month provide bandages and painkillers in an emergency.',
      price: '$30',
    },
    {
      id: 22,
      image: 'https://placeimg.com/160/130/arch',
      desc: 'Each month could save a life by providing antivenom after a snakebite.',
      price: '$60',
    }
  ],
};

class DonateFormView extends React.Component {
  state = {
    frequency: 'one-time',
    oneTimeSelection: null,
    monthlySelection: null,
  };

  onSelectFrequency = frequency => this.setState({ frequency });

  onSelectOneTime = id => this.setState({ oneTimeSelection: id });
  onSelectMonthly = id => this.setState({ monthlySelection: id });

  render() {
    const { frequency, oneTimeSelection, monthlySelection } = this.state;
    const selectedPriceHandles = frequency === 'one-time' ? priceHandles.oneTime : priceHandles.monthly;
    const onClick = frequency === 'one-time' ? this.onSelectOneTime : this.onSelectMonthly;
    const selectedId = frequency === 'one-time' ? oneTimeSelection : monthlySelection;

    return (
      <div style={{ width: '480px', margin: '60px auto' }}>
        <div className="text-center" style={{ marginBottom: '20px' }}>
          <SelectButton
            title="One Time"
            onClick={event => this.onSelectFrequency('one-time')}
            isSelected={frequency === 'one-time'}
          />
          <SelectButton
            title="Monthly"
            onClick={event => this.onSelectFrequency('monthly')}
            isSelected={frequency === 'monthly'}
          />
        </div>

        {selectedPriceHandles.map(data => (
          <PriceHandle
            key={data.id}
            data={data}
            isSelected={data.id === selectedId}
            onClick={event => onClick(data.id)}
          />
        ))}
      </div>
    );
  }
}

export default DonateFormView;
