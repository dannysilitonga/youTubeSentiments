import React from 'react';
import Dropdown from 'react-bootstrap/Dropdown';

export default function DateDropdown({ dateSelected }) {
	return (
		<Dropdown>
			<Dropdown.Toggle variant="primary" id="dropdown-basic">
				Please select date
			</Dropdown.Toggle>

			<Dropdown.Menu>
				<Dropdown.Item onSelect={() => dateSelected("march15")}>March 15</Dropdown.Item>
				<Dropdown.Item onSelect={() => dateSelected("march22")}>March 22</Dropdown.Item>
				
			</Dropdown.Menu>
		</Dropdown>
	)
}