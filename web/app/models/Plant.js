
'use strict';

var mongoose = require( 'mongoose' );

var schema = new mongoose.Schema(
    {
        LatinName:       { type: String },
        Author:      { type: String },
        BotanicalReferences:       { type: String },
        Family:           { type: String },
        CommonName:          { type: String },
        Habit:            { type: String },
        DeciduousEvergreen:       { type: String },
        Height:         { type: String },
        Width:  { type: String },
        Hardyness: { type: String },
        "InCultivation?":      { type: String },
        Medicinal:  { type: String },
        Range:  { type: String },
        Habitat:  { type: String },
        Soil:  { type: String },
        Shade:  { type: String },
        Moisture:  { type: String },
        WellDrained:  { type: String },
        NitrogenFixer:  { type: String },
        PH:  { type: String },
        Acid:  { type: String },
        Alkaline:  { type: String },
        Saline:  { type: String },
        Wind:  { type: String },
        GrowthRate:  { type: String },
        Pollution:  { type: String },
        PoorSoil:  { type: String },
        Drought:  { type: String },
        Wildlife:  { type: String },
        Woodland:  { type: String },
        Meadow:  { type: String },
        Wall:  { type: String },
        InLeaf:  { type: String },
        FloweringTime:  { type: String },
        SeedRipens:  { type: String },
        FlowerType:  { type: String },
        Pollinators:  { type: String },
        SelfFertile:  { type: String },
        KnownHazards:  { type: String },
        Synonyms:  { type: String },
        CultivationDetails:  { type: String },
        EdibleUses:  { type: String },
        UsesNotes:  { type: String },
        Propagation1:  { type: String },
        Cultivars:  { type: String },
        CultivarsInCultivation:  { type: String },
        HeavyClay:  { type: String },
        PullOut:  { type: String },
        LastUpdate:  { type: String },
        RecordChecked:  { type: String },
        FrostTender:  { type: String },
        SiteSpecificNotes:  { type: String },
        Scented:  { type: String },
        InLeafStart:  { type: String },
        InLeafEnd:  { type: String },
        FloweringTimeStart:  { type: String },
        FloweringTimeEnd:  { type: String },
        SeedRipensStart:  { type: String },
        SeedRipensEnd:  { type: String },
        PalatableRating:  { type: String },
        UseRating:  { type: String },
        Rating:  { type: String },
        GrowRating:  { type: String },
        MedicinalRating:  { type: String },
        OverallRating:  { type: String },
        Ratings: {
            PalatableRating:  { type: String },
            UseRating:  { type: String },
            Rating:  { type: String },
            GrowRating:  { type: String },
            MedicinalRating:  { type: String },
            OverallRating:  { type: String }
        },
        Functions: {
            NitrogenFixer: { type: Boolean },
            DynamicAccumulator: { type: Boolean },
            Wildlife: { type: String },
            InvertShelter: { type: Boolean },
            Nectary: { type: String },
            GroundCover: { type: Boolean },
            Aromatic: { type: Boolean },
            Coppice: { type: Boolean }
        }
        
    }
);

schema.index({
    LatinName:       'text',
    CommonName:      'text',
    Family:       'text'
});

exports = module.exports = mongoose.model( 'Plant' , schema );