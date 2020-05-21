import React from 'react';
import ReactDom from 'react-dom';
import { render, cleanup, fireEvent } from '@testing-library/react';
import renderer from 'react-test-renderer';

import '@testing-library/jest-dom/extend-expect';

import { CrosswordRenderContext } from '../../Crossword/context';
import Cell from '../Cell';

afterEach(cleanup);

const renderContext = {
  gridBackground: 'black',
  cellBackground: 'white',
  cellBorder: '#333',
  textColor: '#666',
  numberColor: 'red',
  focusBackground: '#f88',
  highlightBackground: '#fdd',
  cellSize: 10,
  cellPadding: 1,
  cellInner: 8,
  cellHalf: 4,
  fontSize: 7,
};

const defaultProps = {
  cellData: {
    row: 0,
    col: 0,
    guess: '',
    // number: '1',
  },
  focus: false,
  highlight: false,
};

function CellHelper(props) {
  return (
    <CrosswordRenderContext.Provider value={renderContext}>
      <svg viewBox="0 0 100 100">
        <Cell {...props} />
      </svg>
    </CrosswordRenderContext.Provider>
  );
}

function cellFromContainer(container) {
  return container.firstChild.firstChild.firstChild;
}

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDom.render(<CellHelper {...defaultProps} />, div);
  ReactDom.unmountComponentAtNode(div);
});

it('renders Cell component correctly', () => {
  const { container } = render(<CellHelper {...defaultProps} />);
  const rect = container.querySelector('rect');
  expect(rect.getAttribute('fill')).toBe(renderContext.cellBackground);
  expect(rect.getAttribute('stroke')).toBe(renderContext.cellBorder);
});

it('matches snapshot', () => {
  const tree = renderer.create(<CellHelper {...defaultProps} />).toJSON();
  expect(tree).toMatchSnapshot();
});

it('handles click events', () => {
  let clicked = false;
  const { container } = render(
    <CellHelper
      {...defaultProps}
      onClick={(data) => {
        expect(data).toBe(defaultProps.cellData);
        clicked = true;
      }}
    />
  );
  fireEvent.click(cellFromContainer(container), {});
  expect(clicked).toBeTruthy();
});

it('handles click events with no handler', () => {
  const { container } = render(<CellHelper {...defaultProps} />);
  fireEvent.click(cellFromContainer(container), {});
});

it('renders focus background when focused', () => {
  const { container } = render(<CellHelper {...defaultProps} focus />);
  const rect = container.querySelector('rect');
  expect(rect.getAttribute('fill')).toBe(renderContext.focusBackground);
});

it('renders highlight background when highlighted', () => {
  const { container } = render(<CellHelper {...defaultProps} highlight />);
  const rect = container.querySelector('rect');
  expect(rect.getAttribute('fill')).toBe(renderContext.highlightBackground);
});

it('renders focus background when focused and highlighted', () => {
  const { container } = render(
    <CellHelper {...defaultProps} focus highlight />
  );
  const rect = container.querySelector('rect');
  expect(rect.getAttribute('fill')).toBe(renderContext.focusBackground);
});

it('renders number when present', () => {
  const { getByText } = render(
    <CellHelper
      {...defaultProps}
      cellData={{ ...defaultProps.cellData, number: 'NUMBER' }}
    />
  );
  expect(getByText('NUMBER')).toBeTruthy();
});