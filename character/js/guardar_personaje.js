// Importar módulos necesarios de Firebase
import { db } from "../../inicializarFB.js";
import { addDoc, collection, query, where, getDocs, getDoc, doc, updateDoc, deleteDoc } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js'

import { recoverData } from "./pokemon_fetch.js";
import { recoverUserWithLogId } from "./../../users/js/user_recover.js";
import { redirection } from './../../redirect.js';
import { getCurrentUser } from './../../login/login.js';


document.addEventListener("DOMContentLoaded", () => {
    const formUpdate = document.getElementById("update");
    const formCreate = document.getElementById("submit");



    // Verificar si está el formulario "update" para cargar datos del personaje
    if (formUpdate) {
        fillInformationForm(); // Llenar el formulario con la información del personaje si es formulario "update"
        formUpdate.addEventListener("submit", async (event) => {
            event.preventDefault();

            if (!formUpdate.checkValidity()) {
                alert("Please fill out all required fields");
                return;
            }

            // Recuperar de params
            const urlParams = new URLSearchParams(window.location.search);
            const characterId = urlParams.get('id');
            const characterAffiliation = urlParams.get('affiliation');

            console.log("Character ID:", characterId, "Affiliation:", characterAffiliation);

            if (!characterId || !characterAffiliation) {
                console.error("Character ID or affiliation is missing.");
                return;
            }
            ///recuperar el usuario logeado
            const userLog = await getCurrentUser();
            const characterData = {
                name: document.getElementById("name").value.trim(),
                gender: document.getElementById("gender").value.trim(),
                age: document.getElementById("age").value.trim(),
                affiliation: document.getElementById("afiliation").value,
                pokemonName: document.getElementById("pokemon-name").options[document.getElementById("pokemon-name").selectedIndex].textContent,
                moves: [
                    document.getElementById("move1").value.trim(),
                    document.getElementById("move2").value.trim(),
                    document.getElementById("move3").value.trim(),
                    document.getElementById("move4").value.trim(),
                ],
                description: document.getElementById("description").value.trim(),
                specialTraits: document.getElementById("special-traits").value.trim(),
                personality: document.getElementById("personality").value.trim(),
                story: document.getElementById("story").value.trim(),
                extra: document.getElementById("extra").value.trim(),
                creator: userLog.uid
                // owner: userLog.uid
            };

            // Verificar si la afiliación ha cambiado
            if (characterAffiliation !== characterData.affiliation) {
                // Si la afiliación ha cambiado, borrar el antiguo documento
                try {
                    await deleteDoc(doc(db, characterAffiliation, characterId));
                    console.log("Documento eliminado correctamente.");
                } catch (error) {
                    console.error("Error al borrar el personaje:", error);
                    return;  // Detener el proceso si el borrado falla
                }

                // Crear el documento en la nueva colección
                const collectionRef = collection(db, characterData.affiliation);
                const nameQuery = query(collectionRef, where("name", "==", characterData.name));
                const querySnapshot = await getDocs(nameQuery);

                // Verificar si ya existe un personaje con ese nombre en la nueva colección
                if (!querySnapshot.empty) {
                    // Si existe, modificar el nombre del personaje para evitar duplicados
                    characterData.name = `${characterData.name}-${Date.now()}`;
                }

                try {
                    const docRef = await addDoc(collectionRef, characterData);
                    console.log("Personaje guardado con éxito en la colección:", characterData.affiliation);
                    // Redirigir al personaje recién creado
                    window.location.href = redirection(`character/character_view.html?affiliation=${characterData.affiliation}&id=${doc.id}`);

                    // window.location.href = `/character/character_view.html?affiliation=${characterData.affiliation}&id=${docRef.id}`;
                } catch (error) {
                    console.error("Error al guardar el personaje:", error);
                }

            } else {
                // Si la afiliación no ha cambiado, solo actualizar el documento
                try {
                    const characterRef = doc(db, characterAffiliation, characterId);
                    await updateDoc(characterRef, characterData);
                    console.log("Personaje actualizado con éxito en la colección:", characterAffiliation);
                    // Redirigir al personaje actualizado
                    window.location.href = redirection(`character/character_view.html?affiliation=${characterData.affiliation}&id=${doc.id}`);

                    // window.location.href = `/character/character_view.html?affiliation=${characterAffiliation}&id=${characterId}`;
                } catch (error) {
                    console.error("Error al actualizar el personaje:", error);
                }
            }
        });


    }

    // Verificar si está el formulario "create" para crear nuevo personaje
    if (formCreate) {
        formCreate.addEventListener("click", async (event) => {
            //hay que mirar que TODOS los campos estén rellenos
            //excepto moves porque puede estar alguno vacio, MIN 1

            ///recuperar el usuario logeado
            const userLog = await getCurrentUser();

            const characterData = {
                name: document.getElementById("name").value.trim(),
                gender: document.getElementById("gender").value.trim(),
                age: document.getElementById("age").value.trim(),
                affiliation: document.getElementById("afiliation").value,
                pokemonName: document.getElementById("pokemon-name").options[document.getElementById("pokemon-name").selectedIndex].textContent,
                moves: [
                    document.getElementById("move1").value.trim(),
                    document.getElementById("move2").value.trim(),
                    document.getElementById("move3").value.trim(),
                    document.getElementById("move4").value.trim(),
                ],
                description: document.getElementById("description").value.trim(),
                specialTraits: document.getElementById("special-traits").value.trim(),
                personality: document.getElementById("personality").value.trim(),
                story: document.getElementById("story").value.trim(),
                extra: document.getElementById("extra").value.trim(),
                // creator: document.getElementById("owner_hidden").value.trim(),
                owner: userLog.uid
            };


            try {
                const collectionRef = collection(db, characterData.affiliation); // Crear referencia a la colección
                const nameQuery = query(collectionRef, where("name", "==", characterData.name));
                const querySnapshot = await getDocs(nameQuery);

                if (!querySnapshot.empty) {
                    characterData.name = `${characterData.name}-${Date.now()}`;
                }

                const docRef = await addDoc(collectionRef, characterData);
                console.log("Personaje guardado con éxito en la colección:", characterData.affiliation);

                // Redirigir al personaje
                window.location.href = redirection(`character/character_view.html?affiliation=${characterData.affiliation}&id=${docRef.id}`);

                // window.location.href = `/character/character_view.html?affiliation=${characterData.affiliation}&id=${docRef.id}`;
            } catch (error) {
                console.error("Error al guardar el personaje:", error);
            }
        });
    }


});

let selectedMoves = {}; // Guardará el valor seleccionado en cada input

// Recuperar la información del personaje
async function getCharacterData() {
    const urlParams = new URLSearchParams(window.location.search);
    const characterId = urlParams.get('id');
    const characterAffiliation = urlParams.get('affiliation');
    // console.log("Character ID:", characterId, "Affiliation:", characterAffiliation);

    if (!characterId || !characterAffiliation) {
        console.error("No character ID or affiliation provided in the URL.");
        return null;
    }

    try {
        const characterRef = doc(db, characterAffiliation, characterId);
        const docSnap = await getDoc(characterRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            // console.log("Character data:", data);
            return data; // Devolver los datos del personaje
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error retrieving character data:", error);
        return null;
    }
}

// Llenar el formulario con la información del personaje
async function fillInformationForm() {
    console.log("Llamada a fillInformationForm");

    const data = await getCharacterData(); // Esperar a obtener los datos del personaje

    const user = await recoverUserWithLogId(data.owner);
    if (data) {
        // Llenar los elementos del formulario con los datos obtenidos
        document.getElementById("name").value = data.name || '';
        document.getElementById("gender").value = data.gender || '';
        document.getElementById("age").value = data.age || '';
        document.getElementById("afiliation").value = data.affiliation || ''; // PENDING MIRAR
        document.getElementById("description").value = data.description || '';
        document.getElementById("special-traits").value = data.specialTraits || '';
        document.getElementById("personality").value = data.personality || '';
        document.getElementById("story").value = data.story || '';
        document.getElementById("extra").value = data.extra || '';



        document.getElementById("owner").value = user.username || '';
        document.getElementById("owner_hidden").value = data.owner || '';

        //RELLENAR POKEMON
        //hay que buscar todos los pokemon
        const pokemonData = [];
        await recoverData(pokemonData);

        //recuperar select
        const pokemonSelect = document.getElementById("pokemon-name");

        //borrar todos los options de los select
        pokemonSelect.innerHTML = '';

        var pokemonSelected = "";
        //crear un option por cada pokemon
        pokemonData.forEach(pokemon => {
            //si el pokemon de data es el mismo, es un selected
            const option = document.createElement('option');
            option.value = pokemon.url;
            option.textContent = pokemon.name;
            if (pokemon.name === data.pokemonName) {
                option.selected = true;
                pokemonSelected = pokemon.url;
            }
            pokemonSelect.appendChild(option);
        });

        var moves = [];
        //recuperar los moveset del pokemon
        await fetch(pokemonSelected)
            .then(response => response.json())
            .then(data => {
                moves = data.moves.map(move => move.move.name); // Obtener solo los nombres de los movimientos

            })
            .catch(error => {
                console.error("Error fetching data:", error);
            });

        const moveInputs = Array.from(document.querySelectorAll('#moves-container input'));

        //actualizamos los valores iniciales
        selectedMoves['move1'] = data.moves[0];
        selectedMoves['move2'] = data.moves[1];
        selectedMoves['move3'] = data.moves[2];
        selectedMoves['move4'] = data.moves[3];
        //damos un evento change a los inputs
        moveInputs.forEach((input, contador) => {
            //lo escrito en el input
            input.value = data.moves[contador];

            //eventos
            input.addEventListener('input', handleInputChange);
            input.addEventListener('change', handleInputChange); // Cada cambio actualizará los datos seleccionados
        });

        //actualizamos los movimieentos con los valores iniciales
        updateAvailableMoves();

    } else {
        console.log("No se encontraron datos para este personaje.");
    }



    function handleInputChange(event) {
        const input = event.target;
        const inputValue = input.value.toLowerCase();

        //si se vacía que se actualice 
        if (inputValue === '') {
            selectedMoves[input.id] = null;
            updateAvailableMoves();
        }
        // Actualizar selectedMoves con el nuevo valor
        else if (inputValue && moves.includes(inputValue)) {
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
            // console.log(availableMoves, selectedMoves);

            // Agregar movimientos restantes como opciones de datalist
            availableMoves.forEach(move => {
                const option = document.createElement('option');
                option.value = move;
                datalist.appendChild(option);
            });
        });
    }
}
