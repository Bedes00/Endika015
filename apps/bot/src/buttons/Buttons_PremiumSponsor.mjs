// Generated by ReScript, PLEASE EDIT WITH CARE

import * as Env from "../Env.mjs";
import * as Uuid from "uuid";
import * as Ethers from "ethers";
import * as Endpoints from "../Endpoints.mjs";
import * as Exceptions from "../Exceptions.mjs";
import * as Gist$Utils from "@brightidbot/utils/src/Gist.mjs";
import * as Core__Option from "@rescript/core/src/Core__Option.mjs";
import * as Decode$Shared from "@brightidbot/shared/src/Decode.mjs";
import * as Commands_Verify from "../commands/Commands_Verify.mjs";
import * as Constants$Shared from "@brightidbot/shared/src/Constants.mjs";
import * as Services_Sponsor from "../services/Services_Sponsor.mjs";
import * as Caml_js_exceptions from "rescript/lib/es6/caml_js_exceptions.js";

function sleep(_ms) {
  return (new Promise((resolve) => setTimeout(resolve, _ms)));
}

Env.createEnv(undefined);

var config = Env.getConfig(undefined);

var envConfig;

if (config.TAG === /* Ok */0) {
  envConfig = config._0;
} else {
  throw {
        RE_EXN_ID: Env.EnvError,
        _1: config._0,
        Error: new Error()
      };
}

async function noWriteToGistMessage(interaction) {
  var options = {
    content: "It seems like I can't write to my database at the moment. Please try again or contact the BrightID support.",
    ephemeral: true
  };
  return await interaction.followUp(options);
}

function gistConfig(param) {
  return Gist$Utils.makeGistConfig(envConfig.gistId, "guildData.json", envConfig.githubAccessToken);
}

async function execute(interaction) {
  var guild = interaction.guild;
  var guildId = guild.id;
  var member = interaction.member;
  var memberId = member.id;
  var uuid = Uuid.v5(memberId, envConfig.uuidNamespace);
  var exit = 0;
  var val;
  try {
    val = await interaction.deferReply({
          ephemeral: true
        });
    exit = 1;
  }
  catch (e){
    throw e;
  }
  if (exit === 1) {
    var exit$1 = 0;
    var guilds;
    try {
      guilds = await Gist$Utils.ReadGist.content(gistConfig(undefined), Decode$Shared.Decode_Gist.brightIdGuilds);
      exit$1 = 2;
    }
    catch (e$1){
      await Commands_Verify.unknownErrorMessage(interaction);
      throw e$1;
    }
    if (exit$1 === 2) {
      var guildData = guilds[guildId];
      if (guildData !== undefined) {
        var exit$2 = 0;
        var val$1;
        try {
          val$1 = await Services_Sponsor.handleSponsor(interaction, undefined, undefined, uuid);
          exit$2 = 3;
        }
        catch (raw_errorMessage){
          var errorMessage = Caml_js_exceptions.internalToOCamlException(raw_errorMessage);
          if (errorMessage.RE_EXN_ID === Services_Sponsor.HandleSponsorError) {
            var guildName = guild.name;
            console.error("User: " + uuid + " from server " + guildName + " ran into an unexpected error: ", errorMessage._1);
            await Commands_Verify.unknownErrorMessage(interaction);
          } else if (errorMessage.RE_EXN_ID === "JsError") {
            var guildName$1 = guild.name;
            console.error("User: " + uuid + " from server " + guildName$1 + " ran into an unexpected error: ", errorMessage._1);
            await Commands_Verify.unknownErrorMessage(interaction);
          } else {
            throw errorMessage;
          }
        }
        if (exit$2 === 3) {
          switch (val$1) {
            case /* SponsorshipUsed */0 :
                var premiumSponsorshipsUsed = Core__Option.getWithDefault(guildData.premiumSponsorshipsUsed, Ethers.constants.Zero.toString());
                var premiumSponsorshipsUsed$1 = Ethers.BigNumber.from(premiumSponsorshipsUsed).add("1").toString();
                var updatePremiumSponsorshipsUsed = await Gist$Utils.UpdateGist.updateEntry(guilds, guildId, {
                      role: guildData.role,
                      name: guildData.name,
                      inviteLink: guildData.inviteLink,
                      roleId: guildData.roleId,
                      sponsorshipAddress: guildData.sponsorshipAddress,
                      sponsorshipAddressEth: guildData.sponsorshipAddressEth,
                      usedSponsorships: guildData.usedSponsorships,
                      assignedSponsorships: guildData.assignedSponsorships,
                      premiumSponsorshipsUsed: premiumSponsorshipsUsed$1,
                      premiumExpirationTimestamp: guildData.premiumExpirationTimestamp
                    }, gistConfig(undefined));
                if (updatePremiumSponsorshipsUsed.TAG === /* Ok */0) {
                  var options = await Services_Sponsor.successfulSponsorMessageOptions(uuid);
                  await interaction.followUp(options);
                } else {
                  console.error("Buttons Sponsor: Error updating premium used sponsorships", updatePremiumSponsorshipsUsed._0);
                  await noWriteToGistMessage(interaction);
                }
                break;
            case /* RetriedCommandDuring */1 :
                var options$1 = {
                  content: "Your request is still processing. Maybe you haven't scanned the QR code yet?\n\n If you have already scanned the code, please wait a few minutes for BrightID nodes to sync your sponsorship request",
                  ephemeral: true
                };
                await interaction.followUp(options$1);
                break;
            case /* NoUnusedSponsorships */2 :
                await interaction.followUp(Services_Sponsor.noUnusedSponsorshipsOptions(undefined));
                break;
            case /* TimedOut */3 :
                var options$2 = await Services_Sponsor.unsuccessfulSponsorMessageOptions(uuid);
                await interaction.editReply(options$2);
                break;
            
          }
        }
        return ;
      }
      await noWriteToGistMessage(interaction);
      throw {
            RE_EXN_ID: Exceptions.PremiumSponsorButtonError,
            _1: "Buttons_PremiumSponsor: Guild with guildId: " + guildId + " not found in gist",
            Error: new Error()
          };
    }
    
  }
  
}

var brightIdVerificationEndpoint = Endpoints.brightIdVerificationEndpoint;

var brightIdAppDeeplink = Endpoints.brightIdAppDeeplink;

var brightIdLinkVerificationEndpoint = Endpoints.brightIdLinkVerificationEndpoint;

var context = Constants$Shared.context;

var makeCanvasFromUri = Commands_Verify.makeCanvasFromUri;

var createMessageAttachmentFromCanvas = Commands_Verify.createMessageAttachmentFromCanvas;

var makeBeforeSponsorActionRow = Commands_Verify.makeBeforeSponsorActionRow;

var unknownErrorMessage = Commands_Verify.unknownErrorMessage;

var customId = "before-premium-sponsor";

export {
  brightIdVerificationEndpoint ,
  brightIdAppDeeplink ,
  brightIdLinkVerificationEndpoint ,
  context ,
  makeCanvasFromUri ,
  createMessageAttachmentFromCanvas ,
  makeBeforeSponsorActionRow ,
  unknownErrorMessage ,
  sleep ,
  envConfig ,
  noWriteToGistMessage ,
  gistConfig ,
  execute ,
  customId ,
}
/*  Not a pure module */
