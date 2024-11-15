
var pokemonListJS = [];
var pokemonWithoutUsed = [];
//funcion para recuperar todos los datos y guardarlo en la array
export async function recoverData(pokemonList) {
    try {
        let offset = 0;
        let limit = 100;
        let nextURL = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;

        while (nextURL) {
            const response = await fetch(nextURL);
            const data = await response.json();
            nextURL = data.next;

            // Agrega cada Pokémon como una opción en el <select>
            //recorrer data.results
            data.results.forEach(pokemon => {

                //si no es null, crear option
                if (!pokemon) {
                    return;
                }

                //meter pokemon en la array
                pokemonList.push(pokemon);
            });
        }

    } catch (error) {
        console.error("Error loading Pokémon data:", error);
    }

    //se ha cargado todo, llama a la funcion
    loadPokemonNames();


}


//esto carga los datos en el option 
function loadPokemonNames() {
    const pokemonSelect = document.getElementById('pokemon-name');
    pokemonWithoutUsed = pokemonListJS;

    pokemonListJS.forEach(pokemon => {
        // console.log(pokemon);
        const option = document.createElement('option');
        option.value = pokemon.url;
        option.textContent = pokemon.name;
        pokemonSelect.appendChild(option);
    });

    pokemonSelect.options[0].textContent = "Select a Pokémon";
}

document.addEventListener('DOMContentLoaded', function () {
    recoverData(pokemonListJS);
    let contar = 1;
    let moves = [];
    let selectedMoves = {}; // Guardará el valor seleccionado en cada input

    //cuando cambia
    document.getElementById('pokemon-name').addEventListener('change', function () {

        //recupera los movimientos
        fetch(this.value)
            .then(response => response.json())
            .then(data => {
                moves = data.moves.map(move => move.move.name); // Obtener solo los nombres de los movimientos
                initializeMoveInputs();
            })
            .catch(error => {
                console.error("Error fetching data:", error);
            });


        //que salga un boton para crear otro pokemon
        createMorePokemon();

        updatePokemonSelected();

        //crear options de los nuevos select

        //quita de la array de pokemonwithouUsed el que acabas de seleccionar
        pokemonWithoutUsed = pokemonWithoutUsed.filter(pokemon => pokemon.url !== this.value);
    });

    function updatePokemonSelected() {
        //reset pokemonWihtoutUsed
        pokemonWithoutUsed = [];
        pokemonWithoutUsed = pokemonListJS;

        // //recuperar los selects
        // const pokemonSelect = document.getElementsByClassName('pokemon-select');
        // //recorrer los select y guardar los seleccionados en una array
        // const pokemonSelected = Array.from(pokemonSelect).map(select => select.value);

        // //borrar todos los options de los select
        // Array.from(pokemonSelect).forEach(select => {
        //     select.innerHTML = '';
        // });

        //crear de nuevo los options en los select pero sin los seleccionados
        pokemonListJS.forEach((pokemon, index) => {
            //si el pokemon index==pokemon list entonces meterlo como selected
            const option = document.createElement('option');
            option.value = pokemon.url;
            option.textContent = pokemon.name;
            pokemonSelect[0].appendChild(option);
        });

        // console.log(pokemonSelected);
        //quitar de la array de pokemonwithouUsed los de pokemonSelected
        // pokemonWithoutUsed = pokemonWithoutUsed.filter(pokemon => !pokemonSelected.includes(pokemon.url));
    }

    function createMorePokemon() {
        document.getElementById('create-pokemon').style.display = 'block';
        document.getElementById('create-pokemon').addEventListener('click', function () {
            var container = document.getElementById('pokemon-container');

            //crear un select
            var select = document.createElement('select');
            select.classList.add('pokemon-select');
            select.id = 'pokemon-name' + contar;

            //crear options con
            pokemonWithoutUsed.forEach(pokemon => {
                var option = document.createElement('option');
                option.value = pokemon.url;
                option.textContent = pokemon.name;
                select.appendChild(option);
            });

            select.options[0].textContent = "Select a Pokémon";
            select.addEventListener('change', updatePokemonSelected);

            container.appendChild(select);

            contar++;

            //crear un option
        });
    }

    function initializeMoveInputs() {
        const moveInputs = Array.from(document.querySelectorAll('#moves-container input'));

        moveInputs.forEach(input => {
            input.addEventListener('input', handleInputChange);
            input.addEventListener('change', handleInputChange); // Cada cambio actualizará los datos seleccionados
        });
    }

    function handleInputChange(event) {
        const input = event.target;
        const inputValue = input.value.toLowerCase();

        // Actualizar selectedMoves con el nuevo valor
        if (inputValue && moves.includes(inputValue)) {
            // Si el movimiento existe en moves y no está en uso, asignarlo
            selectedMoves[input.id] = inputValue;
            updateAvailableMoves();
        } else if (inputValue && !moves.includes(inputValue)) {
            // Permitir valores que no están en moves
            selectedMoves[input.id] = inputValue;
            updateAvailableMoves();
        }
    }

    function updateAvailableMoves() {
        const moveInputs = Array.from(document.querySelectorAll('#moves-container input'));

        moveInputs.forEach(input => {
            // Limpiar sugerencias previas
            const datalistId = `${input.id}-list`;
            let datalist = document.getElementById(datalistId);
            if (!datalist) {
                datalist = document.createElement('datalist');
                datalist.id = datalistId;
                document.body.appendChild(datalist);
                input.setAttribute('list', datalistId);
            }
            datalist.innerHTML = '';

            // Filtrar los movimientos que ya están seleccionados
            const availableMoves = moves.filter(move => !Object.values(selectedMoves).includes(move));

            // Agregar movimientos restantes como opciones de datalist
            availableMoves.forEach(move => {
                const option = document.createElement('option');
                option.value = move;
                datalist.appendChild(option);
            });
        });
    }
});
