import { useState, useEffect } from "react";
import Logo from "../assets/images/logo.svg";
import { FaSearch } from "react-icons/fa";
import { fetchAllPokemon, fetchPokemonByUrl } from "../api/PokemonApi";
import { useNavigate } from "react-router-dom";
import styles from "./customScrollbar.module.css";
import radio from "./radio.module.css";
import { Dices } from "lucide-react";
import clsx from "clsx";

export default function PokeProject() {
  const [pokemonList, setPokemonList] = useState([]);
  const [filteredPokemonList, setFilteredPokemonList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState("number");
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const allPokemon = await fetchAllPokemon();
        const detailedPokemon = await Promise.all(
          allPokemon.map(async (pokemon) => {
            const details = await fetchPokemonByUrl(pokemon.url);
            return details;
          })
        );
        setPokemonList(detailedPokemon);
        setFilteredPokemonList(detailedPokemon);
        setLoading(false);
      } catch (err) {
        window.alert(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const filteredList = pokemonList.filter((pokemon) => {
      const formattedId = formatId(pokemon.id);
      const lowerCaseQuery = searchQuery.toLowerCase();

      if (sortOption === "number") {
        return formattedId.includes(lowerCaseQuery);
      } else {
        return pokemon.name.toLowerCase().includes(lowerCaseQuery);
      }
    });

    if (sortOption === "name") {
      filteredList.sort((a, b) => a.name.localeCompare(b.name));
    }

    setFilteredPokemonList(filteredList);
  }, [searchQuery, sortOption, pokemonList]);

  const handleButtonClick = () => {
    setShowModal(!showModal);
  };

  const handleSortChange = (option) => {
    setSortOption(option);
    setSearchQuery("");
    setShowModal(false);
  };

  const handleCardClick = (pokemon) => {
    navigate(`/pokemon/${pokemon.id}`);
  };

  const formatId = (id) => id.toString().padStart(3, "0");

  const generateRandomPokemon = () => {
    if (pokemonList.length > 0) {
      const randomIndex = Math.floor(Math.random() * pokemonList.length);
      const randomPokemon = pokemonList[randomIndex];

      if (sortOption === "number") {
        setSearchQuery(`${formatId(randomPokemon.id)}`);
      } else {
        setSearchQuery(randomPokemon.name.toLowerCase());
      }

      setFilteredPokemonList([randomPokemon]);
    }
  };

  const SortButton = () => (
    <div>
      <div
        onClick={handleButtonClick}
        className={clsx(
          "shadow-inner cursor-pointer bg-white rounded-full",
          "w-[40px] h-[40px]",
          "flex justify-center z-50 text-center self-center"
        )}>
        <button className="text-center text-xl text-[#DC0A2D] font-semibold">
          {sortOption === "number" ? "#" : "A̲"}
        </button>
      </div>
      {showModal && (
        <>
          <div
            className={clsx(
              "fixed inset-0  max-w-[360px]  ml-auto mr-auto",
              "bg-black bg-opacity-50 z-40"
            )}
            onClick={() => setShowModal(false)}></div>
          <div className="relative">
            <div
              className={clsx(
                "absolute right-0 top-4 align-center p-1",
                "bg-[#DC0A2D] rounded-xl shadow-lg z-50"
              )}>
              <p className="p-4 text-white font-bold">Sort by:</p>
              <div className="bg-white rounded-xl">
                <div className="p-4">
                  <div className="flex">
                    <label
                      className="cursor-pointer flex items-center"
                      htmlFor="sortByNumber">
                      <input
                        type="radio"
                        id="sortByNumber"
                        name="sortOption"
                        className={`${radio.hiddenRadio} cursor-pointer mr-2`}
                        checked={sortOption === "number"}
                        onChange={() => handleSortChange("number")}
                      />
                      <span
                        className={`${radio.customRadio} ${
                          sortOption === "number" ? radio.checkedRadio : ""
                        }`}>
                        {sortOption === "number" && (
                          <span className={radio.innerCircle}></span>
                        )}
                      </span>
                      Number
                    </label>
                  </div>
                  <div className="flex mt-2">
                    <label
                      className="cursor-pointer flex items-center"
                      htmlFor="sortByName">
                      <input
                        type="radio"
                        id="sortByName"
                        name="sortOption"
                        className={`${radio.hiddenRadio} cursor-pointer mr-2`}
                        checked={sortOption === "name"}
                        onChange={() => handleSortChange("name")}
                      />
                      <span
                        className={`${radio.customRadio} ${
                          sortOption === "name" ? radio.checkedRadio : ""
                        }`}>
                        {sortOption === "name" && (
                          <span className={radio.innerCircle}></span>
                        )}
                      </span>
                      Name
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );

  return (
    <div
      className={clsx(
        "relative bg-[#DC0A2D]min-h-screen ",
        "max-w-[360px] ml-auto mr-auto"
      )}>
      <div className="relative bg-[#DC0A2D] p-1">
        <div className="p-2">
          <div className="flex mb-4 gap-2">
            <img src={Logo} alt="Logo" />
            <h1 className="text-white font-poppins font-bold text-[24px]">
              Pokédex
            </h1>
          </div>
          <div className="flex justify-between mb-4">
            <div className="flex justify-between relative">
              <div
                className={clsx(
                  "flex gap-2 p-2 bg-white rounded-full w-[280px] shadow-inner-md",
                  "mobile:w-[250px]",
                  "mobile-lg:w-[280px]"
                )}>
                <FaSearch className="ml-1 h-4 w-5 text-[#DC0A2D] self-center" />
                <input
                  placeholder="Search"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="outline-none text-[#666666] font-poppins bg-transparent w-20"
                />{" "}
                <button
                  onClick={generateRandomPokemon}
                  className="ml-auto text-[#DC0A2D]">
                  {" "}
                  <Dices className="mr-1" />
                </button>
              </div>
            </div>
            <SortButton />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-inner-lg">
          <div
            className={clsx(
              styles.scrollContainer,
              "w-full p-3 overflow-y-scroll h-[75vh]"
            )}>
            {loading ? (
              <p>Loading...</p>
            ) : filteredPokemonList.length > 0 ? (
              <div className="grid grid-cols-3 md:grid-cols-3 gap-2 ">
                {filteredPokemonList.map((pokemon) => (
                  <div
                    key={pokemon.id}
                    className={clsx(
                      "relative cursor-pointer flex flex-col items-center",
                      "bg-white rounded-lg shadow border overflow-hidden"
                    )}
                    onClick={() => handleCardClick(pokemon)}>
                    <div className="flex flex-col z-10 p-1">
                      <p className="text-right text-[8px] text-[#666666] font-poppins">
                        #{formatId(pokemon.id)}
                      </p>
                      <div className="flex justify-center items-center flex-1">
                        <img
                          src={
                            pokemon.sprites.other["official-artwork"]
                              .front_default
                          }
                          alt={pokemon.name}
                          className="w-[72px]"
                        />
                      </div>
                      <div className="absolute inset-x-0 h-32 w-[100px] bg-[#EFEFEF] rounded-t-[7px] -z-40 top-16"></div>
                      <h2 className="text-[10px] capitalize text-center font-poppins">
                        {pokemon.name}
                      </h2>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500">Data tidak ditemukan</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
