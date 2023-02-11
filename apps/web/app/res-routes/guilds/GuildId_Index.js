// Generated by ReScript, PLEASE EDIT WITH CARE

import * as React from "react";
import * as Js_exn from "../../../../../node_modules/rescript/lib/es6/js_exn.js";
import * as AuthServer from "../../AuthServer.js";
import * as AdminButton from "../../components/AdminButton.js";
import * as Caml_option from "../../../../../node_modules/rescript/lib/es6/caml_option.js";
import * as Core__Array from "../../../../../node_modules/@rescript/core/src/Core__Array.js";
import * as Core__Option from "../../../../../node_modules/@rescript/core/src/Core__Option.js";
import * as Decode$Shared from "../../../../../node_modules/@brightidbot/shared/src/Decode.js";
import * as DiscordServer from "../../DiscordServer.js";
import * as SidebarToggle from "../../components/SidebarToggle.js";
import * as WebUtils_Gist from "../../utils/WebUtils_Gist.js";
import * as $$Node from "@remix-run/node";
import * as ReactHotToast from "react-hot-toast";
import ReactHotToast$1 from "react-hot-toast";
import * as React$1 from "@remix-run/react";
import * as SponsorshipsPopup from "../../components/SponsorshipsPopup.js";
import * as JsxRuntime from "react/jsx-runtime";
import * as Caml_js_exceptions from "../../../../../node_modules/rescript/lib/es6/caml_js_exceptions.js";
import * as DiscordLoginButton from "../../components/DiscordLoginButton.js";
import * as Guilds_AdminSubmit from "./admin/Guilds_AdminSubmit.js";
import * as Rainbowkit from "@rainbow-me/rainbowkit";

var Await = {};

var defaultLoader_discordGuildPromise = Promise.resolve(null);

var defaultLoader = {
  maybeUser: undefined,
  isAdmin: false,
  discordGuildPromise: defaultLoader_discordGuildPromise
};

async function loader(param) {
  var guildId = Core__Option.getWithDefault(param.params["guildId"], "");
  var maybeUser;
  var exit = 0;
  var data;
  try {
    data = await AuthServer.authenticator.isAuthenticated(param.request);
    exit = 1;
  }
  catch (raw_exn){
    var exn = Caml_js_exceptions.internalToOCamlException(raw_exn);
    if (exn.RE_EXN_ID === "JsError") {
      maybeUser = undefined;
    } else {
      throw exn;
    }
  }
  if (exit === 1) {
    maybeUser = (data == null) ? undefined : Caml_option.some(data);
  }
  if (maybeUser === undefined) {
    return $$Node.defer(defaultLoader);
  }
  try {
    var discordGuildPromise = DiscordServer.fetchDiscordGuildFromId(guildId);
    var userId = Caml_option.valFromOption(maybeUser).profile.id;
    var guildMember = await DiscordServer.fetchGuildMemberFromId(guildId, userId);
    var memberRoles = (guildMember == null) ? [] : guildMember.roles;
    var guildRoles;
    try {
      guildRoles = await DiscordServer.fetchGuildRoles(guildId);
    }
    catch (raw_exn$1){
      var exn$1 = Caml_js_exceptions.internalToOCamlException(raw_exn$1);
      if (exn$1.RE_EXN_ID === "JsError") {
        guildRoles = [];
      } else {
        throw exn$1;
      }
    }
    var isAdmin = DiscordServer.memberIsAdmin(guildRoles, memberRoles);
    return $$Node.defer({
                maybeUser: maybeUser,
                isAdmin: isAdmin,
                discordGuildPromise: discordGuildPromise
              });
  }
  catch (raw_e){
    var e = Caml_js_exceptions.internalToOCamlException(raw_e);
    if (e.RE_EXN_ID === Js_exn.$$Error) {
      console.error(e._1);
      return defaultLoader;
    }
    throw e;
  }
}

async function action(param) {
  var request = param.request;
  var guildId = Core__Option.getWithDefault(param.params["guildId"], "");
  var exit = 0;
  var data;
  try {
    data = await AuthServer.authenticator.isAuthenticated(request);
    exit = 1;
  }
  catch (raw_exn){
    var exn = Caml_js_exceptions.internalToOCamlException(raw_exn);
    if (exn.RE_EXN_ID !== "JsError") {
      throw exn;
    }
    
  }
  exit === 1;
  var data$1 = await request.formData();
  var match = Guilds_AdminSubmit.Form.make(data$1);
  var config = WebUtils_Gist.makeGistConfig(process.env.GIST_ID, "guildData.json", process.env.GITHUB_ACCESS_TOKEN);
  var content = await WebUtils_Gist.ReadGist.content(config, Decode$Shared.Decode_Gist.brightIdGuilds);
  var entry = content[guildId];
  var prevEntry;
  if (entry !== undefined) {
    prevEntry = entry;
  } else {
    throw {
          RE_EXN_ID: Guilds_AdminSubmit.GuildDoesNotExist,
          _1: guildId,
          Error: new Error()
        };
  }
  var entry_role = prevEntry.role;
  var entry_name = prevEntry.name;
  var entry_inviteLink = prevEntry.inviteLink;
  var entry_roleId = prevEntry.roleId;
  var entry_sponsorshipAddress = match.sponsorshipAddress;
  var entry_sponsorshipAddressEth = prevEntry.sponsorshipAddressEth;
  var entry_usedSponsorships = prevEntry.usedSponsorships;
  var entry_assignedSponsorships = prevEntry.assignedSponsorships;
  var entry_premiumSponsorshipsUsed = prevEntry.premiumSponsorshipsUsed;
  var entry_premiumExpirationTimestamp = prevEntry.premiumExpirationTimestamp;
  var entry$1 = {
    role: entry_role,
    name: entry_name,
    inviteLink: entry_inviteLink,
    roleId: entry_roleId,
    sponsorshipAddress: entry_sponsorshipAddress,
    sponsorshipAddressEth: entry_sponsorshipAddressEth,
    usedSponsorships: entry_usedSponsorships,
    assignedSponsorships: entry_assignedSponsorships,
    premiumSponsorshipsUsed: entry_premiumSponsorshipsUsed,
    premiumExpirationTimestamp: entry_premiumExpirationTimestamp
  };
  var data$2;
  try {
    data$2 = await WebUtils_Gist.UpdateGist.updateEntry(content, guildId, entry$1, config);
  }
  catch (raw_e){
    var e = Caml_js_exceptions.internalToOCamlException(raw_e);
    if (e.RE_EXN_ID === "JsError") {
      return {
              TAG: /* Error */1,
              _0: {
                RE_EXN_ID: "JsError",
                _1: e._1
              }
            };
    }
    throw e;
  }
  return {
          TAG: /* Ok */0,
          _0: data$2
        };
}

function $$default(param) {
  var match = React$1.useLoaderData();
  var isAdmin = match.isAdmin;
  var maybeUser = match.maybeUser;
  var context = React$1.useOutletContext();
  var matches = React$1.useMatches();
  var id = Core__Option.map(matches[matches.length - 1 | 0], (function (match) {
          return match.id;
        }));
  React.useEffect((function () {
          if (context.rateLimited) {
            ReactHotToast$1.error("The bot is being rate limited. Please try again later", undefined);
          }
          
        }), []);
  var guildHeader = JsxRuntime.jsx(React.Suspense, {
        children: Caml_option.some(JsxRuntime.jsx(React$1.Await, {
                  resolve: match.discordGuildPromise,
                  children: (function (maybeDiscordGuild) {
                      return Core__Option.mapWithDefault((maybeDiscordGuild == null) ? undefined : Caml_option.some(maybeDiscordGuild), JsxRuntime.jsx(JsxRuntime.Fragment, {}), (function (discordGuild) {
                                    return JsxRuntime.jsxs("div", {
                                                children: [
                                                  JsxRuntime.jsx("img", {
                                                        className: "rounded-full h-24",
                                                        src: Core__Option.getWithDefault(Core__Option.map(discordGuild.icon, (function (icon) {
                                                                    return "https://cdn.discordapp.com/icons/" + discordGuild.id + "/" + icon + ".png";
                                                                  })), "")
                                                      }),
                                                  JsxRuntime.jsx("p", {
                                                        children: discordGuild.name,
                                                        className: "text-4xl font-bold text-white"
                                                      }),
                                                  isAdmin ? JsxRuntime.jsx(AdminButton.make, {
                                                          guildId: discordGuild.id
                                                        }) : JsxRuntime.jsx(JsxRuntime.Fragment, {})
                                                ],
                                                className: "flex gap-6 w-full justify-start items-center p-4"
                                              });
                                  }));
                    })
                })),
        fallback: Caml_option.some(JsxRuntime.jsx("p", {
                  children: "Loading...",
                  className: "text-3xl text-white font-poppins p-4"
                }))
      });
  var showPopup = Core__Option.getWithDefault(Core__Array.reverse(Core__Option.getWithDefault(id, "").split("/"))[0], "") === "$guildId";
  return JsxRuntime.jsxs("div", {
              children: [
                JsxRuntime.jsx(ReactHotToast.Toaster, {}),
                JsxRuntime.jsxs("div", {
                      children: [
                        JsxRuntime.jsxs("header", {
                              children: [
                                JsxRuntime.jsx(SidebarToggle.make, {
                                      handleToggleSidebar: context.handleToggleSidebar,
                                      maybeUser: maybeUser
                                    }),
                                JsxRuntime.jsx("div", {
                                      children: JsxRuntime.jsx(Rainbowkit.ConnectButton, {
                                            className: "h-full"
                                          }),
                                      className: "flex flex-col md:flex-row gap-2 items-center justify-center"
                                    })
                              ],
                              className: "flex flex-row justify-between md:justify-end items-center m-4"
                            }),
                        maybeUser !== undefined ? JsxRuntime.jsxs(JsxRuntime.Fragment, {
                                children: [
                                  guildHeader,
                                  JsxRuntime.jsxs("div", {
                                        children: [
                                          JsxRuntime.jsx("section", {
                                                children: JsxRuntime.jsx(React$1.Outlet, {}),
                                                className: "width-full flex flex-col md:flex-row justify-around items-center w-full"
                                              }),
                                          showPopup ? JsxRuntime.jsx(SponsorshipsPopup.make, {}) : JsxRuntime.jsx(JsxRuntime.Fragment, {})
                                        ],
                                        className: "flex flex-1 flex-col  justify-around items-center text-center relative"
                                      })
                                ]
                              }) : JsxRuntime.jsxs("div", {
                                children: [
                                  JsxRuntime.jsx("p", {
                                        children: "Please login to continue",
                                        className: "text-3xl text-white font-poppins"
                                      }),
                                  JsxRuntime.jsx(DiscordLoginButton.make, {
                                        label: "Login To Discord"
                                      })
                                ],
                                className: "flex flex-col items-center justify-center h-full gap-4"
                              })
                      ],
                      className: "flex flex-col h-screen"
                    })
              ],
              className: "flex-1"
            });
}

export {
  Await ,
  defaultLoader ,
  loader ,
  action ,
  $$default ,
  $$default as default,
}
/* defaultLoader Not a pure module */
