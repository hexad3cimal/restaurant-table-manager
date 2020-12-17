import { request } from '../modules/client.js';
import { add } from './branch.js';
jest.mock('../modules/client.js');
describe('fetchAuthorsFromApi', () => {
  const addUser = add({payload:{username:"jovin"}});
 
  it('should wait for every FETCH_AUTHORS action and call makeAuthorsApiRequest', async () => {
      global.restAppConfig = {api:""}
      request.mockReturnValue({message: "success", responseCode: 200})
      const generator =  addUser.next();
  
    expect(generator.value)
      .toEqual({message: "success", responseCode: 200});
  });
  
  
});