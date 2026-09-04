<?php

namespace Database\Seeders;

use App\Models\Song;
use App\Models\SongCategory;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class SongSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::first();
        $adminId = $admin?->id;

        $categories = [
            ['name' => 'Worship', 'description' => 'Songs of adoration, reflection, and quiet worship.', 'display_order' => 1],
            ['name' => 'Praise', 'description' => 'Upbeat and joyful songs of praise and thanksgiving.', 'display_order' => 2],
            ['name' => 'Offering', 'description' => 'Songs sung during tithes and offerings.', 'display_order' => 3],
            ['name' => 'Communion', 'description' => 'Songs reflecting on the Lord\'s Supper and the Cross.', 'display_order' => 4],
            ['name' => 'Christmas', 'description' => 'Songs celebrating the birth of Jesus Christ.', 'display_order' => 5],
            ['name' => 'Easter', 'description' => 'Songs celebrating the resurrection of Christ.', 'display_order' => 6],
            ['name' => 'Youth', 'description' => 'Songs popular in youth ministry and fellowship.', 'display_order' => 7],
            ['name' => 'Special', 'description' => 'Special items and choir selections.', 'display_order' => 8],
        ];

        $createdCategories = [];
        foreach ($categories as $cat) {
            $createdCategories[$cat['name']] = SongCategory::firstOrCreate(
                ['name' => $cat['name']],
                [
                    'uuid' => (string) Str::uuid(),
                    'name' => $cat['name'],
                    'description' => $cat['description'],
                    'display_order' => $cat['display_order'],
                    'status' => 'active',
                ]
            );
        }

        $sampleSongs = [
            [
                'title' => 'Amazing Grace (How Sweet the Sound)',
                'artist' => 'John Newton',
                'composer' => 'John Newton',
                'category' => 'Worship',
                'featured' => true,
                'status' => 'published',
                'lyrics' => "VERSE 1\nAmazing grace! How sweet the sound\nThat saved a wretch like me!\nI once was lost, but now am found;\nWas blind, but now I see.\n\nVERSE 2\n'Twas grace that taught my heart to fear,\nAnd grace my fears relieved;\nHow precious did that grace appear\nThe hour I first believed!\n\nCHORUS\nMy chains are gone, I've been set free\nMy God, my Savior has ransomed me\nAnd like a flood His mercy reigns\nUnending love, amazing grace\n\nVERSE 3\nThe Lord has promised good to me,\nHis Word my hope secures;\nHe will my Shield and Portion be,\nAs long as life endures.\n\nVERSE 4\nWhen we've been there ten thousand years,\nBright shining as the sun,\nWe've no less days to sing God's praise\nThan when we first begun.",
            ],
            [
                'title' => 'How Great Is Our God',
                'artist' => 'Chris Tomlin',
                'composer' => 'Chris Tomlin, Ed Cash, Jesse Reeves',
                'category' => 'Praise',
                'featured' => true,
                'status' => 'published',
                'lyrics' => "VERSE 1\nThe splendor of a King, clothed in majesty\nLet all the earth rejoice, all the earth rejoice\nHe wraps Himself in light, and darkness tries to hide\nAnd trembles at His voice, and trembles at His voice\n\nCHORUS\nHow great is our God! Sing with me:\nHow great is our God! And all will see how great,\nHow great is our God!\n\nVERSE 2\nAnd age to age He stands, and time is in His hands\nBeginning and the End, Beginning and the End\nThe Godhead, three in one, Father, Spirit, Son\nThe Lion and the Lamb, the Lion and the Lamb\n\nBRIDGE\nName above all names, worthy of all praise\nMy heart will sing: How great is our God!",
            ],
            [
                'title' => '10,000 Reasons (Bless the Lord)',
                'artist' => 'Matt Redman',
                'composer' => 'Matt Redman, Jonas Myrin',
                'category' => 'Worship',
                'featured' => true,
                'status' => 'published',
                'lyrics' => "CHORUS\nBless the Lord, O my soul, O my soul\nWorship His holy name\nSing like never before, O my soul\nI'll worship Your holy name\n\nVERSE 1\nThe sun comes up, it's a new day dawning\nIt's time to sing Your song again\nWhatever may pass, and whatever lies before me\nLet me be singing when the evening comes\n\nVERSE 2\nYou're rich in love, and You're slow to anger\nYour name is great, and Your heart is kind\nFor all Your goodness I will keep on singing\nTen thousand reasons for my heart to find\n\nVERSE 3\nAnd on that day when my strength is failing\nThe end draws near and my time has come\nStill my soul will sing Your praise unending\nTen thousand years and then forevermore",
            ],
            [
                'title' => 'What A Beautiful Name',
                'artist' => 'Hillsong Worship',
                'composer' => 'Ben Fielding, Brooke Ligertwood',
                'category' => 'Worship',
                'featured' => false,
                'status' => 'published',
                'lyrics' => "VERSE 1\nYou were the Word at the beginning\nOne with God the Lord Most High\nYour hidden glory in creation\nNow revealed in You Our Christ\n\nCHORUS 1\nWhat a beautiful Name it is, What a beautiful Name it is\nThe Name of Jesus Christ my King\nWhat a beautiful Name it is, Nothing compares to this\nWhat a beautiful Name it is, The Name of Jesus\n\nVERSE 2\nYou didn't want heaven without us\nSo Jesus You brought heaven down\nMy sin was great Your love was greater\nWhat could separate us now\n\nCHORUS 2\nWhat a wonderful Name it is, What a wonderful Name it is\nThe Name of Jesus Christ my King\nWhat a wonderful Name it is, Nothing compares to this\nWhat a wonderful Name it is, The Name of Jesus\n\nBRIDGE\nDeath could not hold You, the veil tore before You\nYou silence the boast of sin and grave\nThe heavens are roaring, the praise of Your glory\nFor You are raised to life again\nYou have no rival, You have no equal\nNow and forever God You reign\nYours is the kingdom, Yours is the glory\nYours is the Name above all names\n\nCHORUS 3\nWhat a powerful Name it is, What a powerful Name it is\nThe Name of Jesus Christ my King\nWhat a powerful Name it is, Nothing can stand against\nWhat a powerful Name it is, The Name of Jesus",
            ],
            [
                'title' => 'Cornerstone',
                'artist' => 'Hillsong Worship',
                'composer' => 'Edward Mote, Eric Liljero, Jonas Myrin',
                'category' => 'Worship',
                'featured' => false,
                'status' => 'published',
                'lyrics' => "VERSE 1\nMy hope is built on nothing less\nThan Jesus' blood and righteousness\nI dare not trust the sweetest frame\nBut wholly trust in Jesus' Name\n\nCHORUS\nChrist alone, Cornerstone\nWeak made strong in the Savior's love\nThrough the storm, He is Lord\nLord of all\n\nVERSE 2\nWhen darkness seems to hide His face\nI rest on His unchanging grace\nIn every high and stormy gale\nMy anchor holds within the veil\nMy anchor holds within the veil\n\nVERSE 3\nWhen He shall come with trumpet sound\nOh may I then in Him be found\nDressed in His righteousness alone\nFaultless to stand before the throne",
            ],
            [
                'title' => 'ព្រះគុណដ៏ស្ចារ្យ (Khmer Worship)',
                'artist' => 'Horaios Choir',
                'composer' => 'Traditional',
                'category' => 'Offering',
                'featured' => true,
                'status' => 'published',
                'lyrics' => "ខទី 1\nព្រះគុណដ៏ស្ចារ្យ នៃព្រះអម្ចាស់\nបានសង្គ្រោះខ្ញុំ ឲ្យផុតពីបាប\nខ្ញុំធ្លាប់វង្វេង ឥឡូវត្រឡប់\nភ្នែកងងឹត ឥឡូវមើលឃើញ។\n\nបន្ទរ\nព្រះអង្គទ្រង់ស្រឡាញ់ខ្ញុំ\nទ្រង់បានរំដោះ ព្រលឹងខ្ញុំ\nសេចក្ដីមេត្តា ទ្រង់នៅរហូត\nសេចក្ដីស្រឡាញ់ មិនប្រែប្រួលឡើយ។",
            ],
        ];

        foreach ($sampleSongs as $i => $s) {
            $cat = $createdCategories[$s['category']] ?? null;
            Song::firstOrCreate(
                ['title' => $s['title']],
                [
                    'uuid' => (string) Str::uuid(),
                    'title' => $s['title'],
                    'artist' => $s['artist'],
                    'composer' => $s['composer'],
                    'category_id' => $cat?->id,
                    'lyrics' => $s['lyrics'],
                    'featured' => $s['featured'],
                    'status' => $s['status'],
                    'display_order' => $i + 1,
                    'created_by' => $adminId,
                    'updated_by' => $adminId,
                ]
            );
        }
    }
}
