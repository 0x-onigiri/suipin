module suipin::picker;

// === Imports ===

use std::{
    string::{Self, String},
};
use sui::{
    event,
    random::Random,
    vec_set::{Self, VecSet},
    vec_map::{Self, VecMap},
};

// === Errors ===

const EAlreadyJoined: u64 = 0;
const ENameAlreadyTaken: u64 = 1;
const EAlreadyDid: u64 = 2;
const ENotOwner: u64 = 3;
const ENotEnoughParticipants: u64 = 4;

// === Structs ===

public struct Winner has store, drop {
    tx_digest: vector<u8>,
    winner_addr: address,
    winner_name: String,
}


public struct Picker has key {
    id: UID,
    title: String,
    image_blob_id: String,
    participants: VecMap<address, String>,
    name_registry: VecSet<String>,
    winner_selected: bool,
    winner: Option<Winner>
}

public struct PickerOwnerCap has key, store {
    id: UID,
    picker_id: ID
}

// === Events ===

public struct WinnerSelected has copy, drop {
    picker_id: ID,
    participant_addr: address,
    participant_name: String,
}

// === Public Functions ===

entry fun create_picker(title: String, image_blob_id: String, ctx: &mut TxContext) {
    let mut picker = Picker {
        id: object::new(ctx),
        title,
        image_blob_id,
        participants: vec_map::empty(),
        name_registry: vec_set::empty(),
        winner_selected: false,
        winner: option::none()
    };

    let picker_owner_cap = PickerOwnerCap {
        id: object::new(ctx),
        picker_id: picker.id.to_inner()
    };

    // join_(&mut picker, b"たろう", @0x1);
    // join_(&mut picker, b"花子", @0x2);
    // join_(&mut picker, b"Mike", @0x3);
    // join_(&mut picker, b"ココナッツ", @0x4);
    // join_(&mut picker, b"絆", @0x5);
    // join_(&mut picker, b"💩", @0x6);
    // join_(&mut picker, b"Poop", @0x7);
    // join_(&mut picker, b"LFG", @0x8);
    // join_(&mut picker, b"💧💧💧", @0x9);
    // join_(&mut picker, b"idx_9", @0xa);
    // join_(&mut picker, b"idx_10", @0xb);
    // join_(&mut picker, b"idx_11", @0xc);
    // join_(&mut picker, b"idx_12", @0xd);
    // join_(&mut picker, b"idx_13", @0xe);
    // join_(&mut picker, b"idx_14", @0xf);
    // join_(&mut picker, b"idx_15", @0x10); // 16
    // join_(&mut picker, b"idx_16", @0x11); // 17
    // join_(&mut picker, b"idx_17", @0x12); // 18
    // join_(&mut picker, b"idx_18", @0x13); // 19
    // join_(&mut picker, b"idx_19", @0x14); // 20
    // join_(&mut picker, b"idx_20", @0x15); // 21
    // join_(&mut picker, b"idx_21", @0x16); // 22
    // join_(&mut picker, b"idx_22", @0x17); // 23
    // join_(&mut picker, b"idx_23", @0x18); // 24
    // join_(&mut picker, b"idx_24", @0x19); // 25
    // join_(&mut picker, b"idx_25", @0x1a); // 26
    // join_(&mut picker, b"idx_26", @0x1b); // 27
    // join_(&mut picker, b"idx_27", @0x1c); // 28
    // join_(&mut picker, b"idx_28", @0x1d); // 29
    // join_(&mut picker, b"idx_29", @0x1e); // 30
    // join_(&mut picker, b"idx_30", @0x1f); // 31
    // join_(&mut picker, b"idx_31", @0x20); // 32
    // join_(&mut picker, b"idx_32", @0x21); // 33
    // join_(&mut picker, b"idx_33", @0x22); // 34
    // join_(&mut picker, b"idx_34", @0x23); // 35
    // join_(&mut picker, b"idx_35", @0x24); // 36
    // join_(&mut picker, b"idx_36", @0x25); // 37
    // join_(&mut picker, b"idx_37", @0x26); // 38
    // join_(&mut picker, b"idx_38", @0x27); // 39
    // join_(&mut picker, b"idx_39", @0x28); // 40
    // join_(&mut picker, b"idx_40", @0x29); // 41
    // join_(&mut picker, b"idx_41", @0x2a); // 42
    // join_(&mut picker, b"idx_42", @0x2b); // 43
    // join_(&mut picker, b"idx_43", @0x2c); // 44
    // join_(&mut picker, b"idx_44", @0x2d); // 45
    // join_(&mut picker, b"idx_45", @0x2e); // 46
    // join_(&mut picker, b"idx_46", @0x2f); // 47
    // join_(&mut picker, b"idx_47", @0x30); // 48
    // join_(&mut picker, b"idx_48", @0x31); // 49
    // join_(&mut picker, b"idx_49", @0x32); // 50
    // join_(&mut picker, b"idx_50", @0x33); // 51
    // join_(&mut picker, b"idx_51", @0x34); // 52
    // join_(&mut picker, b"idx_52", @0x35); // 53
    // join_(&mut picker, b"idx_53", @0x36); // 54
    // join_(&mut picker, b"idx_54", @0x37); // 55
    // join_(&mut picker, b"idx_55", @0x38); // 56
    // join_(&mut picker, b"idx_56", @0x39); // 57
    // join_(&mut picker, b"idx_57", @0x3a); // 58
    // join_(&mut picker, b"idx_58", @0x3b); // 59
    // join_(&mut picker, b"idx_59", @0x3c); // 60
    // join_(&mut picker, b"idx_60", @0x3d); // 61
    // join_(&mut picker, b"idx_61", @0x3e); // 62
    // join_(&mut picker, b"idx_62", @0x3f); // 63
    // join_(&mut picker, b"idx_63", @0x40); // 64
    // join_(&mut picker, b"idx_64", @0x41); // 65
    // join_(&mut picker, b"idx_65", @0x42); // 66
    // join_(&mut picker, b"idx_66", @0x43); // 67
    // join_(&mut picker, b"idx_67", @0x44); // 68
    // join_(&mut picker, b"idx_68", @0x45); // 69
    // join_(&mut picker, b"idx_69", @0x46); // 70
    // join_(&mut picker, b"idx_70", @0x47); // 71
    // join_(&mut picker, b"idx_71", @0x48); // 72
    // join_(&mut picker, b"idx_72", @0x49); // 73
    // join_(&mut picker, b"idx_73", @0x4a); // 74
    // join_(&mut picker, b"idx_74", @0x4b); // 75
    // join_(&mut picker, b"idx_75", @0x4c); // 76
    // join_(&mut picker, b"idx_76", @0x4d); // 77
    // join_(&mut picker, b"idx_77", @0x4e); // 78
    // join_(&mut picker, b"idx_78", @0x4f); // 79
    // join_(&mut picker, b"idx_79", @0x50); // 80
    // join_(&mut picker, b"idx_80", @0x51); // 81
    // join_(&mut picker, b"idx_81", @0x52); // 82
    // join_(&mut picker, b"idx_82", @0x53); // 83
    // join_(&mut picker, b"idx_83", @0x54); // 84
    // join_(&mut picker, b"idx_84", @0x55); // 85
    // join_(&mut picker, b"idx_85", @0x56); // 86
    // join_(&mut picker, b"idx_86", @0x57); // 87
    // join_(&mut picker, b"idx_87", @0x58); // 88
    // join_(&mut picker, b"idx_88", @0x59); // 89
    // join_(&mut picker, b"idx_89", @0x5a); // 90
    // join_(&mut picker, b"idx_90", @0x5b); // 91
    // join_(&mut picker, b"idx_91", @0x5c); // 92
    // join_(&mut picker, b"idx_92", @0x5d); // 93
    // join_(&mut picker, b"idx_93", @0x5e); // 94
    // join_(&mut picker, b"idx_94", @0x5f); // 95
    // join_(&mut picker, b"idx_95", @0x60); // 96
    // join_(&mut picker, b"idx_96", @0x61); // 97
    // join_(&mut picker, b"idx_97", @0x62); // 98
    // join_(&mut picker, b"idx_98", @0x63); // 99
    // join_(&mut picker, b"idx_99", @0x64); // 100
    // join_(&mut picker, b"idx_100", @0x65); // 101
    // join_(&mut picker, b"idx_101", @0x66); // 102
    // join_(&mut picker, b"idx_102", @0x67); // 103
    // join_(&mut picker, b"idx_103", @0x68); // 104
    // join_(&mut picker, b"idx_104", @0x69); // 105
    // join_(&mut picker, b"idx_105", @0x6a); // 106
    // join_(&mut picker, b"idx_106", @0x6b); // 107
    // join_(&mut picker, b"idx_107", @0x6c); // 108
    // join_(&mut picker, b"idx_108", @0x6d); // 109
    // join_(&mut picker, b"idx_109", @0x6e); // 110
    // join_(&mut picker, b"idx_110", @0x6f); // 111
    // join_(&mut picker, b"idx_111", @0x70); // 112
    // join_(&mut picker, b"idx_112", @0x71); // 113
    // join_(&mut picker, b"idx_113", @0x72); // 114
    // join_(&mut picker, b"idx_114", @0x73); // 115
    // join_(&mut picker, b"idx_115", @0x74); // 116
    // join_(&mut picker, b"idx_116", @0x75); // 117
    // join_(&mut picker, b"idx_117", @0x76); // 118
    // join_(&mut picker, b"idx_118", @0x77); // 119
    // join_(&mut picker, b"idx_119", @0x78); // 120

    transfer::transfer(picker_owner_cap, ctx.sender());
    transfer::share_object(picker);
}

entry fun join(
    picker: &mut Picker,
    name: vector<u8>,
    ctx: &TxContext,
) {
    join_(picker, name, ctx.sender())
}

entry fun do(cap: &PickerOwnerCap, picker: &mut Picker, random: &Random, ctx: &mut TxContext) {
    assert!(!picker.winner_selected, EAlreadyDid);
    assert!(picker.id.to_inner() == cap.picker_id, ENotOwner);

    let participant_count = picker.participants.size();
    assert!(participant_count >= 2, ENotEnoughParticipants);

    let mut rg = random.new_generator(ctx);
    let idx = rg.generate_u64_in_range(0, participant_count - 1);

    let (addr, name) = picker.participants.get_entry_by_idx(idx);

    event::emit(WinnerSelected {
        picker_id: picker.id.to_inner(),
        participant_addr: *addr,
        participant_name: *name
    });

    picker.winner_selected = true;
    picker.winner = option::some(Winner {
        tx_digest: *ctx.digest(),
        winner_addr: *addr,
        winner_name: *name
    });
}

// === Private Functions ===

fun join_(
    picker: &mut Picker,
    name: vector<u8>,
    sender: address,
) {
    assert!(!picker.participants.contains(&sender), EAlreadyJoined);

    let name_str = string::utf8(name);
    assert!(!picker.name_registry.contains(&name_str), ENameAlreadyTaken);

    picker.name_registry.insert(name_str);
    picker.participants.insert(sender, name_str);
}
