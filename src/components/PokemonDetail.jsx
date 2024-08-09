import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchPokemonByUrl } from "../api/PokemonApi";
import { typeColors } from "../components/PokeColor"; // Import data warna
import { FaArrowLeft } from "react-icons/fa";
import WeightIcon from "../assets/images/weightIcon.svg";
import HeightIcon from "../assets/images/heightIcon.svg";
import { ChevronLeft, ChevronRight } from "lucide-react";

const statAbbreviations = {
  hp: "HP",
  attack: "ATK",
  defense: "DEF",
  "special-attack": "SATK",
  "special-defense": "SDEF",
  speed: "SPD",
};

export default function PokemonDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bgColor, setBgColor] = useState("#DC0A2D");
  const [description, setDescription] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pokemonData = await fetchPokemonByUrl(
          `https://pokeapi.co/api/v2/pokemon/${id}`
        );
        const speciesData = await fetch(
          `https://pokeapi.co/api/v2/pokemon-species/${id}`
        ).then((res) => res.json());
        setPokemon(pokemonData);
        setLoading(false);

        // Get the color for the primary type of the Pokémon
        if (pokemonData.types.length > 0) {
          const primaryType = pokemonData.types[0].type.name;
          setBgColor(typeColors[primaryType] || "#DC0A2D"); // Default color if type not found
        }
        const englishDescription = speciesData.flavor_text_entries.find(
          (entry) => entry.language.name === "en"
        );
        setDescription(
          englishDescription
            ? englishDescription.flavor_text.replace(/[\n\f]/g, " ")
            : "No description available."
        );
      } catch (err) {
        console.error(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleNext = () => {
    const nextId = parseInt(id) + 1;
    navigate(`/pokemon/${nextId}`);
  };

  const handlePrevious = () => {
    const previousId = parseInt(id) - 1;
    if (previousId > 0) {
      navigate(`/pokemon/${previousId}`);
    }
  };

  const handleBackToTest = () => {
    navigate("/"); // Route to the test.jsx page
  };

  if (loading) return <p>Loading...</p>;
  if (!pokemon) return <p>Pokémon not found!</p>;

  const formatId = (id) => id.toString().padStart(3, "0");
  const style = {
    backgroundColor: bgColor,
  };

  return (
    <div style={style} className=" max-w-[360px] ml-auto mr-auto">
      <div className="bg-pokeball-pattern bg-no-repeat bg-[95%_5px]">
        <div className="p-2 rounded-xl max-w-lg mx-auto font-poppins">
          <div className="flex items-center mb-32 justify-between p-2">
            <div className="flex text-white ">
              <FaArrowLeft
                className="text-2xl mt-1 mr-4 cursor-pointer"
                onClick={handleBackToTest}
              />
              <h1 className="text-2xl font-bold items-center justify-center capitalize">
                {pokemon.name}
              </h1>
            </div>
            <p className="text-right font-bold text-white">
              #{formatId(pokemon.id)}
            </p>
          </div>
          <div className="overflow-hidden">
            <div className="flex justify-between text-white items-center pb-4 px-4 cursor-pointer">
              {parseInt(id) > 1 && (
                <div>
                  <ChevronLeft onClick={handlePrevious} />
                </div>
              )}

              <div className="ml-auto">
                <ChevronRight onClick={handleNext} />
              </div>
            </div>
            <div className="flex justify-center">
              <img
                src={pokemon.sprites.other["official-artwork"].front_default}
                alt={pokemon.name}
                className="w-[200px] absolute top-20"
              />
            </div>
            <div className="bg-white w-full rounded-lg py-4 p-4 shadow-inner-lg">
              <div className="mt-8 flex justify-center">
                <p className="">
                  {pokemon.types.map((type) => (
                    <span
                      key={type.type.name}
                      className="px-2 py-1 m-2 rounded-full text-white capitalize text-[10px] font-bold"
                      style={{ backgroundColor: typeColors[type.type.name] }}>
                      {type.type.name}
                    </span>
                  ))}
                </p>
              </div>
              <p
                className="font-bold text-sm text-center p-4"
                style={{ color: bgColor }}>
                About
              </p>
              <div className="grid grid-cols-3">
                <div className="flex justify-center items-center border-r-2">
                  <img src={WeightIcon} className="w-5 " />
                  <p className="text-[10px]">{pokemon.weight / 10} kg </p>
                </div>
                <div className="flex justify-center items-center border-r-2">
                  <img src={HeightIcon} className="w-5" />
                  <p className="text-[10px]">{pokemon.height / 10} m </p>
                </div>
                <div>
                  <p className="text-[10px] text-center">
                    {pokemon.abilities.map((ability) => (
                      <span
                        key={ability.ability.name}
                        className="capitalize block">
                        {ability.ability.name}
                      </span>
                    ))}
                  </p>
                </div>
                <div className="text-[10px] text-center text-[#666666] border-r-2 p-2">
                  Weight
                </div>
                <div className="text-[10px] text-center text-[#666666] border-r-2 p-2">
                  Height
                </div>
                <div className="text-[10px] text-center text-[#666666] p-2">
                  Moves
                </div>
              </div>

              <p className="text-[10px] mt-4">{description}</p>

              <div>
                <p
                  className="font-bold text-sm p-4 text-center"
                  style={{ color: bgColor }}>
                  Base Stats
                </p>
                {pokemon.stats.map((stat) => (
                  <div
                    key={stat.stat.name}
                    className="grid grid-cols-custom-layout gap-2">
                    <div>
                      <p
                        className="text-[10px] bold uppercase font-bold border-r-2"
                        style={{ color: bgColor }}>
                        {statAbbreviations[stat.stat.name] || stat.stat.name}
                      </p>
                    </div>
                    <div className="self-center">
                      <p className="text-[10px]">{stat.base_stat}</p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 self-center">
                      <div
                        className="h-1.5 rounded-s-lg"
                        style={{
                          width: `${stat.base_stat / 2}%`,
                          backgroundColor: bgColor,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
