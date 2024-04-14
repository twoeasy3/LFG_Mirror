import React, { useEffect, useState } from 'react';
import AsyncSelect from 'react-select/async';
import { ActionMeta, SingleValue } from 'react-select';
import { GameData } from '../bin/GetOwnedGames';

interface Props {
  onSelectChange: (selectedOption: number) => void;
  steamID: string;
}

const PromiseOwnedGameSelect: React.FC<Props> = ({ onSelectChange }) => {
  const [optionsReady, setOptionsReady] = useState(false);
  const [options, setOptions] = useState<{ value: number; label: string }[]>([]);

  useEffect(() => {
    const populateWithOwnedGames = async () => {
      try {
        const ownedGamesString: string | null = localStorage.getItem("ownedGames");
        const ownedGames: GameData[] | null = ownedGamesString ? JSON.parse(ownedGamesString) : null;
        if (ownedGames !== null) {
          const updatedOptions = ownedGames.map(game => ({
            value: game.appID,
            label: game.name
          }));
          setOptions(updatedOptions);
          setOptionsReady(true);
        }
      } catch (error) {
        console.error('Error fetching game data:', error);
        setOptions([]);
      }
    };
    populateWithOwnedGames();
  }, []);

  const loadOptions = (inputValue: string) => {
    return new Promise<{ value: number; label: string }[]>(resolve => {
      const filteredOptions = options.filter(option =>
        option.label.toLowerCase().includes(inputValue.toLowerCase())
      );
      resolve(filteredOptions);
    });
  };

  const handleSelectChange = (newValue: SingleValue<{ value: number; label: string }>, _actionMeta: ActionMeta<{ value: number; label: string }>) => {
    if (newValue) {
      onSelectChange(newValue.value);
    }
  };

  return (
    <>
      {optionsReady && (
        <AsyncSelect cacheOptions defaultOptions loadOptions={loadOptions} onChange={handleSelectChange} />
      )}
    </>
  );
};

export default PromiseOwnedGameSelect;