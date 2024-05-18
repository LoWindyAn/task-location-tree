import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Location from './Location';

const mockItem = {
    id: 1,
    label: 'Canada',
    is_area: true,
    locations: [
        {
            id: 2,
            label: 'Anjou Sales Office',
            is_area: false,
            locations: []
        },
        {
            id: 3,
            label: 'Calgary Sales Office',
            is_area: true,
            locations: [
                {
                    id: 4,
                    label: 'Ontario Sales Office',
                    is_area: false,
                    locations: []
                }
            ]
        }
    ]
};

const mockHandleDragStart = jest.fn();
const mockHandleDropItem = jest.fn();
const mockHandleClickLocation = jest.fn();

describe('Location component', () => {
    test('renders component', () => {
        const { getByText } = render(
            <Location
                item={mockItem}
                index={0}
                handleDragStart={mockHandleDragStart}
                handleDropItem={mockHandleDropItem}
                handleClickLocation={mockHandleClickLocation}
                selectLoc={null}
                searchTerm=""
            />
        );

        expect(getByText('Canada')).toBeInTheDocument();
    });

    test('handles Open and Close folder', () => {
        const { getByText, queryByText } = render(
            <Location
                item={mockItem}
                index={0}
                handleDragStart={mockHandleDragStart}
                handleDropItem={mockHandleDropItem}
                handleClickLocation={mockHandleClickLocation}
                selectLoc={null}
                searchTerm=""
            />
        );

        const rootLocation = getByText('Canada');
        fireEvent.click(rootLocation);
        expect(getByText('Anjou Sales Office')).toBeInTheDocument();
        expect(getByText('Calgary Sales Office')).toBeInTheDocument();

        fireEvent.click(rootLocation);
        expect(queryByText('Anjou Sales Office')).not.toBeInTheDocument();
        expect(queryByText('Calgary Sales Office')).not.toBeInTheDocument();
    });

    test('calls handleDragStart when dragging starts', () => {
        const { getByText } = render(
            <Location
                item={mockItem}
                index={0}
                handleDragStart={mockHandleDragStart}
                handleDropItem={mockHandleDropItem}
                handleClickLocation={mockHandleClickLocation}
                selectLoc={null}
                searchTerm=""
            />
        );

        const rootLocation = getByText('Canada');
        fireEvent.dragStart(rootLocation);
        expect(mockHandleDragStart).toHaveBeenCalledWith(mockItem);
    });

    test('calls handleDropItem when an item is dropped', () => {
        const { getByText } = render(
            <Location
                item={mockItem}
                index={0}
                handleDragStart={mockHandleDragStart}
                handleDropItem={mockHandleDropItem}
                handleClickLocation={mockHandleClickLocation}
                selectLoc={null}
                searchTerm=""
            />
        );

        const rootLocation = getByText('Canada');
        fireEvent.drop(rootLocation);
        expect(mockHandleDropItem).toHaveBeenCalledWith(mockItem);
    });
});
