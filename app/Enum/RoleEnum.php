<?php

namespace App\Enum;

enum RoleEnum: int
{
    case Admin          = 1;
    case Student        = 2;
    case Guest          = 3;

}
