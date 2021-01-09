import * as React from "react";
import LoginView from "./LoginView";
import "@testing-library/jest-dom/extend-expect";
import * as redux from "react-redux";
import { render, screen } from "../../testUtils";
import userEvent from "@testing-library/user-event";
import { waitFor } from "@testing-library/react";
describe("LoginView", () => {
  let wrapper;
  beforeAll(() => {
    wrapper = render(<LoginView />);
  });
  it("should render component", () => {
    expect(screen.getByText("Sign in")).toBeInTheDocument();
  });

  it("should show alert when state value is true", () => {
    const useDispatchSpy = jest.spyOn(redux, "useDispatch");
    const mockDispatchFn = jest.fn();
    useDispatchSpy.mockReturnValue(mockDispatchFn);
    jest.spyOn(redux, "useSelector").mockImplementation((callback) =>
      callback({
        app: { alert: { show: true, message: "alert test" } },
        user: { isAuthenticated: false },
      })
    );

    render(<LoginView />);
    expect(mockDispatchFn).toHaveBeenCalledWith({
      payload: {},
      type: "HIDE_ALERT",
    });
  });

  it("should shoud dispatch login action", async () => {
    const useDispatchSpy = jest.spyOn(redux, "useDispatch");
    const mockDispatchFn = jest.fn();
    useDispatchSpy.mockReturnValue(mockDispatchFn);
    jest.spyOn(redux, "useSelector").mockImplementation((callback) =>
      callback({
        app: { alert: { show: false } },
        user: { isAuthenticated: false },
      })
    );

    wrapper = render(<LoginView />);
    const container = wrapper.container;
    const userName = container.querySelector("input[name='userName']");
    const password = container.querySelector("input[name='password']");
    const button = wrapper.getByText("Sign in now");

    //TO DO upgrade jsdom
    await waitFor(() => {
      userEvent.type(userName, "j");
    });
    await waitFor(() => {
      userEvent.type(password, "p");
    });
    await waitFor(() => {
      userEvent.click(button);
    });
    expect(mockDispatchFn).toHaveBeenCalledWith({
      payload: {
        password: "p",
        userName: "j",
      },
      type: "USER_LOGIN",
    });
  });
});
