// Generated by ReScript, PLEASE EDIT WITH CARE

import * as React from "@remix-run/react";
import * as JsxRuntime from "react/jsx-runtime";

function SponsorshipsPopup(props) {
  var match = React.useParams();
  return JsxRuntime.jsx("div", {
              children: JsxRuntime.jsxs("div", {
                    children: [
                      JsxRuntime.jsx("p", {
                            children: "Assign Sponsorships to this server",
                            className: "text-white text-xl"
                          }),
                      JsxRuntime.jsx("div", {
                            children: JsxRuntime.jsx(React.Link, {
                                  className: "bg-brightid p-3 rounded-xl text-xl font-semibold text-white",
                                  to: "/guilds/" + match.guildId + "/sponsorships/assignSponsorships",
                                  children: "Setup Sponsorships"
                                }),
                            className: "flex flex-row items-center gap-4"
                          })
                    ],
                    className: "flex flex-row justify-between items-center gap-2"
                  }),
              className: "p-4 w-full bottom-0 md:bottom-5 absolute bg-extraDark md:rounded-xl md:m-4 shadow-2xl"
            });
}

var make = SponsorshipsPopup;

export {
  make ,
}
/* @remix-run/react Not a pure module */
