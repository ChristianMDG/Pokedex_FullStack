import { PokeApiClient } from "../clients/pokeapi.client";

export class PokemonService {
  private client = new PokeApiClient();

  async listPokemons(limit: number, offset: number) {
    const data = await this.client.getPokemons(limit, offset);

    return data.results.map((pokemon: any) => ({
      name: pokemon.name,
      url: pokemon.url,
    }));
  }

  async getPokemon(name: string) {
    const data = await this.client.getPokemonByName(name);

    return {
      name: data.name,
      image: data.sprites.front_default,
      types: data.types.map((t: any) => t.type.name),
    };
  }
}