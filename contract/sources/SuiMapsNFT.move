// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0
module sui_maps::SuiMapsNFT;

use std::string;
use sui::display;
use sui::event;
use sui::package;
use sui::url::{Self, Url};

/// An example NFT that can be minted by anybody
///
public struct SuiMapsNFT has key, store {
    id: UID,
    /// Name for the token
    name: string::String,
    /// Description of the token
    description: string::String,
    /// Code for the token
    code: string::String,
    url: Url,
    // TODO: allow custom attributes
    project_url: Url,
}

public struct SUIMAPSNFT has drop {}

// ===== Events =====

public struct NFTMinted has copy, drop {
    // The Object ID of the NFT
    object_id: ID,
    // The creator of the NFT
    creator: address,
    // The name of the NFT
    name: string::String,
}

// ===== Public view functions =====

/// Get the NFT's `name`
public fun name(nft: &SuiMapsNFT): &string::String {
    &nft.name
}

/// Get the NFT's `description`
public fun description(nft: &SuiMapsNFT): &string::String {
    &nft.description
}

/// Get the NFT's `url`
public fun url(nft: &SuiMapsNFT): &Url {
    &nft.url
}

fun init(otw: SUIMAPSNFT, ctx: &mut TxContext) {
    let keys = vector[
        string::utf8(b"name"),
        string::utf8(b"description"),
        string::utf8(b"url"),
        string::utf8(b"project_url"),
    ];

    let values = vector[
        string::utf8(b"{name}"),
        string::utf8(b"{description}"),
        string::utf8(b"{url}"),
        string::utf8(b"https://suimaps.vercel.app"),
    ];

    let publisher = package::claim(otw, ctx);

    let mut display = display::new_with_fields<SuiMapsNFT>(
        &publisher,
        keys,
        values,
        ctx,
    );

    display.update_version();

    transfer::public_transfer(publisher, tx_context::sender(ctx));
    transfer::public_transfer(display, tx_context::sender(ctx));
}

#[allow(lint(self_transfer))]
/// Create a new devnet_nft
public fun mint_to_sender(
    name: vector<u8>,
    description: vector<u8>,
    code: vector<u8>,
    ctx: &mut TxContext,
) {
    let sender = ctx.sender();
    let nft = SuiMapsNFT {
        id: object::new(ctx),
        name: string::utf8(name),
        description: string::utf8(description),
        code: string::utf8(code),
        url: url::new_unsafe_from_bytes(b"https://suimaps.vercel.app/sample_nft.png"),
        project_url: url::new_unsafe_from_bytes(b"https://suimaps.vercel.app"),
    };

    event::emit(NFTMinted {
        object_id: object::id(&nft),
        creator: sender,
        name: nft.name,
    });

    transfer::public_transfer(nft, sender);
}

/// Transfer `nft` to `recipient`
public fun transfer(nft: SuiMapsNFT, recipient: address, _: &mut TxContext) {
    transfer::public_transfer(nft, recipient)
}

/// Update the `description` of `nft` to `new_description`
public fun update_description(
    nft: &mut SuiMapsNFT,
    new_description: vector<u8>,
    _: &mut TxContext,
) {
    nft.description = string::utf8(new_description)
}

/// Permanently delete `nft`
public fun burn(nft: SuiMapsNFT, _: &mut TxContext) {
    let SuiMapsNFT { id, name: _, description: _, url: _, project_url: _, code: _ } = nft;
    id.delete()
}
