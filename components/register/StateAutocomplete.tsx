import { useState, useEffect, useMemo } from 'react';
import { Combobox } from "@headlessui/react";

const indianStatesAndUTs = [
    // States
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
    'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
    'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
    'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
    'Uttar Pradesh', 'Uttarakhand', 'West Bengal',

    // Union Territories
    'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
    'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
];

type StateAutocompleteProps = {
    value: string;
    onChange: (val: string) => void;
};

export default function StateAutocomplete({ value, onChange }: StateAutocompleteProps) {
    const [query, setQuery] = useState(value || '');

    useEffect(() => {
        setQuery(value || '');
    }, [value]);

    const filteredStates = useMemo(() => {
        if (!query) return indianStatesAndUTs;
        const lowerVal = query.toLowerCase();

        const startsWithMatches = indianStatesAndUTs.filter((state: string) =>
            state.toLowerCase().startsWith(lowerVal)
        );

        const includesMatches = indianStatesAndUTs.filter((state: string) =>
            !state.toLowerCase().startsWith(lowerVal) &&
            state.toLowerCase().includes(lowerVal)
        );

        return [...startsWithMatches, ...includesMatches];
    }, [query]);

    const handleSelect = (val: string) => {
        onChange(val);
        setQuery(val);
    };

    return (
        <div className="relative w-full">
            <Combobox value={value} onChange={handleSelect}>
                <Combobox.Input
                    className="w-full border p-3 rounded-lg h-10"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search and select state"
                    required
                />
                {filteredStates.length > 0 && (
                    <Combobox.Options className="absolute left-0 right-0 bg-white border mt-1 rounded-lg shadow-lg z-50 max-h-60 overflow-auto">
                        {filteredStates.map(state => {
                            const queryLower = query?.toLowerCase() || '';
                            const index = state.toLowerCase().indexOf(queryLower);
                            return (
                                <Combobox.Option
                                    key={state}
                                    value={state}
                                    className="p-2 cursor-pointer hover:bg-gray-100"
                                >
                                    {index >= 0 ? (
                                        <>
                                            {state.slice(0, index)}
                                            <span className="font-bold">{state.slice(index, index + queryLower.length)}</span>
                                            {state.slice(index + queryLower.length)}
                                        </>
                                    ) : state}
                                </Combobox.Option>
                            );
                        })}
                    </Combobox.Options>
                )}
            </Combobox>
        </div>
    );
}
