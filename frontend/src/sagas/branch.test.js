import { request } from '../modules/client.js';
import { add } from './branch.js';
jest.mock('../modules/client.js');
describe('add branch api', () => {
  const addUser = add({payload:{username:"jovin"}});
 
  it('shouldreturn success', async () => {
      global.restAppConfig = {api:""}
      request.mockReturnValue({message: "success", responseCode: 200})
      const generator =  addUser.next();
  
    expect(generator.value)
      .toEqual({message: "success", responseCode: 200});
  });
  
  
});