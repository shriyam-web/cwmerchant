import { useMemo } from 'react';
import { Combobox } from "@headlessui/react";
import allCities from '@/data/allCities.json';

type CityAutocompleteProps = {
    value: string;
    onChange: (val: string) => void;
};

export default function CityAutocomplete({ value, onChange }: CityAutocompleteProps) {
    // useMemo to filter cities efficiently
    const filteredCities = useMemo(() => {
        if (!value) return [];
        const lowerVal = value.toLowerCase();

        const startsWithMatches = allCities.filter(city =>
            city.toLowerCase().startsWith(lowerVal)
        );

        const includesMatches = allCities.filter(city =>
            !city.toLowerCase().startsWith(lowerVal) &&
            city.toLowerCase().includes(lowerVal)
        );

        return [...startsWithMatches, ...includesMatches];
    }, [value]);

    const handleSelect = (val: string) => {
        onChange(val); // update parent
    };

    return (
        <div className="relative w-full">
            <Combobox value={value} onChange={handleSelect}>
                <Combobox.Input
                    className="w-full border p-3 rounded-lg h-10"
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="Enter your business city"
                />
                {filteredCities.length > 0 && (
                    <Combobox.Options className="absolute left-0 right-0 bg-white border mt-1 rounded-lg shadow-lg z-50 max-h-60 overflow-auto">
                        {filteredCities.map(city => {
                            const index = city.toLowerCase().indexOf(value.toLowerCase());
                            return (
                                <Combobox.Option
                                    key={city}
                                    value={city}
                                    className="p-2 cursor-pointer hover:bg-gray-100"
                                >
                                    {index >= 0 ? (
                                        <>
                                            {city.slice(0, index)}
                                            <span className="font-bold">{city.slice(index, index + value.length)}</span>
                                            {city.slice(index + value.length)}
                                        </>
                                    ) : city}
                                </Combobox.Option>
                            );
                        })}
                    </Combobox.Options>
                )}
            </Combobox>
        </div>
    );
}
