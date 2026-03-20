
import axios from "axios";

const BASE_URL = "https://pokeapi.co/api/v2";

export class PokeApiClient {
  async getPokemons(limit: number = 20, offset: number = 0) {
    const response = await axios.get(`${BASE_URL}/pokemon`, {
      params: { limit, offset },
    });

    return response.data;
  }

  async getPokemonByName(name: string) {
    const response = await axios.get(`${BASE_URL}/pokemon/${name}`);
    return response.data;
  }
}