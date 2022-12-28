// Generated by ReScript, PLEASE EDIT WITH CARE

import * as Env from "../Env.mjs";
import * as Js_dict from "rescript/lib/es6/js_dict.js";
import * as $$Promise from "@ryyppy/rescript-promise/src/Promise.mjs";
import * as Endpoints from "../Endpoints.mjs";
import * as Gist$Utils from "@brightidbot/utils/src/Gist.mjs";
import * as Caml_option from "rescript/lib/es6/caml_option.js";
import * as Decode$Shared from "@brightidbot/shared/src/Decode.mjs";
import * as Caml_exceptions from "rescript/lib/es6/caml_exceptions.js";
import * as Constants$Shared from "@brightidbot/shared/src/Constants.mjs";
import * as Caml_js_exceptions from "rescript/lib/es6/caml_js_exceptions.js";
import * as Services_VerificationInfo from "../services/Services_VerificationInfo.mjs";

var ButtonVerifyHandlerError = /* @__PURE__ */Caml_exceptions.create("Buttons_Verify.ButtonVerifyHandlerError");

var BrightIdError = /* @__PURE__ */Caml_exceptions.create("Buttons_Verify.BrightIdError");

Env.createEnv(undefined);

var config = Env.getConfig(undefined);

var config$1;

if (config.TAG === /* Ok */0) {
  config$1 = config._0;
} else {
  throw {
        RE_EXN_ID: Env.EnvError,
        _1: config._0,
        Error: new Error()
      };
}

function getRolebyRoleId(guildRoleManager, roleId) {
  var guildRole = guildRoleManager.cache.get(roleId);
  if (!(guildRole == null)) {
    return guildRole;
  }
  throw {
        RE_EXN_ID: ButtonVerifyHandlerError,
        _1: "Could not find a role with the id " + roleId,
        Error: new Error()
      };
}

function getGuildDataFromGist(guilds, guildId, interaction) {
  var guildData = Js_dict.get(guilds, guildId);
  if (guildData !== undefined) {
    return Caml_option.valFromOption(guildData);
  }
  interaction.editReply({
        content: "Failed to retreive data for this Discord Guild"
      });
  throw {
        RE_EXN_ID: ButtonVerifyHandlerError,
        _1: "Failed to retreive data for this Discord Guild",
        Error: new Error()
      };
}

function addRoleToMember(guildRole, member) {
  var guildMemberRoleManager = member.roles;
  return guildMemberRoleManager.add(guildRole, undefined);
}

function noMultipleContextIds(member, interaction) {
  var options = {
    content: "Hey, I recognize you, but you have two or more Discord accounts linked to the same BrightID. Unfortunately, the bot doesn't support this yet and can't assign you the BrightID role",
    ephemeral: true
  };
  return interaction.followUp(options).then(function (param) {
              return Promise.reject({
                          RE_EXN_ID: ButtonVerifyHandlerError,
                          _1: "" + member.displayName + ": Verification Info can not be retrieved from more than one Discord account."
                        });
            });
}

function handleUnverifiedGuildMember(errorNum, interaction) {
  switch (errorNum) {
    case 2 :
        var options = {
          content: "Please scan the above QR code in the BrightID mobile app",
          ephemeral: true
        };
        return interaction.followUp(options).then(function (param) {
                    return Promise.resolve(undefined);
                  });
    case 3 :
        var options$1 = {
          content: "I haven't seen you at a Bright ID Connection Party yet, so your brightid is not verified. You can join a party in any timezone at https://meet.brightid.org",
          ephemeral: true
        };
        return interaction.followUp(options$1).then(function (param) {
                    return Promise.resolve(undefined);
                  });
    case 4 :
        var options$2 = {
          content: "Whoops! You haven't received a sponsor. There are plenty of apps with free sponsors, such as the [EIDI Faucet](https://idchain.one/begin/). \n\n See all the apps available at https://apps.brightid.org",
          ephemeral: true
        };
        return interaction.followUp(options$2).then(function (param) {
                    return Promise.resolve(undefined);
                  });
    default:
      var options$3 = {
        content: "Something unexpected happened. Please try again later.",
        ephemeral: true
      };
      return interaction.followUp(options$3).then(function (param) {
                  return Promise.resolve(undefined);
                });
  }
}

function execute(interaction) {
  var guild = interaction.guild;
  var member = interaction.member;
  var guildRoleManager = guild.roles;
  var guildId = guild.id;
  return interaction.deferReply({
                ephemeral: true
              }).then(function (param) {
              var config$2 = Gist$Utils.makeGistConfig(config$1.gistId, "guildData.json", config$1.githubAccessToken);
              return Gist$Utils.ReadGist.content(config$2, Decode$Shared.Decode_Gist.brightIdGuilds).then(function (guilds) {
                          var guildData = getGuildDataFromGist(guilds, guildId, interaction);
                          var roleId = guildData.roleId;
                          if (roleId !== undefined) {
                            return Services_VerificationInfo.getBrightIdVerification(member).then(function (verificationInfo) {
                                        var exit = 0;
                                        var val;
                                        try {
                                          val = verificationInfo;
                                          exit = 1;
                                        }
                                        catch (raw_obj){
                                          var obj = Caml_js_exceptions.internalToOCamlException(raw_obj);
                                          if (obj.RE_EXN_ID === $$Promise.JsError) {
                                            var obj$1 = obj._1;
                                            var options = {
                                              content: "Something unexpected happened. Try again later",
                                              ephemeral: true
                                            };
                                            return interaction.followUp(options).then(function (param) {
                                                        return Promise.reject({
                                                                    RE_EXN_ID: $$Promise.JsError,
                                                                    _1: obj$1
                                                                  });
                                                      });
                                          }
                                          if (obj.RE_EXN_ID === BrightIdError) {
                                            return handleUnverifiedGuildMember(obj._1.errorNum, interaction);
                                          }
                                          throw obj;
                                        }
                                        if (exit === 1) {
                                          var match = val._0;
                                          var unique = match.unique;
                                          var contextIdsLength = match.contextIds.length;
                                          var exit$1 = 0;
                                          if (contextIdsLength !== 0) {
                                            if (contextIdsLength !== 1) {
                                              exit$1 = 2;
                                            } else {
                                              if (unique) {
                                                var guildRole = getRolebyRoleId(guildRoleManager, roleId);
                                                return addRoleToMember(guildRole, member).then(function (param) {
                                                              var options = {
                                                                content: "Hey, I recognize you! I just gave you the \`" + guildRole.name + "\` role. You are now BrightID verified in " + guild.name + " server!",
                                                                ephemeral: true
                                                              };
                                                              return interaction.followUp(options);
                                                            }).then(function (param) {
                                                            return Promise.resolve(undefined);
                                                          });
                                              }
                                              exit$1 = 2;
                                            }
                                          } else {
                                            var options$1 = {
                                              content: "The BrightID has not been linked to Discord. That means the qr code has not been properly scanned!",
                                              ephemeral: true
                                            };
                                            return interaction.followUp(options$1).then(function (param) {
                                                        return Promise.resolve(undefined);
                                                      });
                                          }
                                          if (exit$1 === 2) {
                                            if (unique) {
                                              return noMultipleContextIds(member, interaction);
                                            }
                                            var options$2 = {
                                              content: "Hey, I recognize you, but your account seems to be linked to a possible sybil attack. You are not properly BrightID verified. If this is a mistake, contact one of the support channels",
                                              ephemeral: true
                                            };
                                            return interaction.followUp(options$2).then(function (param) {
                                                        return Promise.reject({
                                                                    RE_EXN_ID: ButtonVerifyHandlerError,
                                                                    _1: "" + member.displayName + " is not unique"
                                                                  });
                                                      });
                                          }
                                          
                                        }
                                        
                                      });
                          }
                          var options = {
                            content: "Hi, sorry about that. I couldn't retrieve the data for this server from BrightID. Try reinviting the bot. \n\n **Note: This will create a new role BrightID Role.**"
                          };
                          return interaction.editReply(options).then(function (param) {
                                      return Promise.reject({
                                                  RE_EXN_ID: ButtonVerifyHandlerError,
                                                  _1: "Guild does not have a saved roleId"
                                                });
                                    });
                        });
            });
}

var brightIdVerificationEndpoint = Endpoints.brightIdVerificationEndpoint;

var brightIdAppDeeplink = Endpoints.brightIdAppDeeplink;

var brightIdLinkVerificationEndpoint = Endpoints.brightIdLinkVerificationEndpoint;

var context = Constants$Shared.context;

var customId = "verify";

export {
  brightIdVerificationEndpoint ,
  brightIdAppDeeplink ,
  brightIdLinkVerificationEndpoint ,
  context ,
  ButtonVerifyHandlerError ,
  BrightIdError ,
  config$1 as config,
  getRolebyRoleId ,
  getGuildDataFromGist ,
  addRoleToMember ,
  noMultipleContextIds ,
  handleUnverifiedGuildMember ,
  execute ,
  customId ,
}
/*  Not a pure module */
